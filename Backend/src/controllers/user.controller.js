import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong to generate access token and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, gender, phoneNo } = req.body;

  // Validate required fields
  const requiredFields = {
    fullName,
    email,
    password,
    username,
    gender,
    phoneNo,
  };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new ApiError(
        400,
        `${key} is required and must be a non-empty string.`
      );
    }
  }

  // Additional validations
  if (fullName.length <= 2)
    throw new ApiError(400, "Full name should be at least 3 characters");
  if (password.length < 8)
    throw new ApiError(400, "Password should be at least 8 characters");

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) throw new ApiError(401, "User already exists");

  // Validate file uploads
  if (!req.files || !req.files.avatar?.[0]?.path) {
    throw new ApiError(400, "Avatar image is required");
  }
  const avatarLocalPath = req.files.avatar[0].path;
  const coverImageLocalPath = req.files.coverImage?.[0]?.path;

  // Upload files to Cloudinary
  console.log(avatarLocalPath);
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

  // Create new user
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    phoneNo,
    gender,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    // Delete file from cloudinary and temp file
    if (coverImage?.public_id) await deleteFromCloudinary(coverImage.public_id);
    if (avatar.public_id) await deleteFromCloudinary(avatar.public_id);
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);

    throw new ApiError(500, "Something went wrong! Can't save details");
  }

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username && !email) throw new ApiError(402, "Provide username or email");

  const user = await User.findOne({
    $or:[{username},{email}]
  });

  if (!user) throw new ApiError(400, "Invalid userName or email");
  const isValidUser = await user.isCorrectPassword(password);
  if(!isValidUser) throw new ApiError(403, "Incorrect Password !");

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

  // we can directly save the token is current user , but to make more secure again take details without token and password
  const loggedInUser = await User.findById(user._id).select("-password -refreshTiken");

  const options = {
    httpOnly : true,    // in production environment it can't be modified by the client side
    secure : process.env.NODE_ENV === "production"
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .json(new ApiResponse(
    200,
    {user : loggedInUser,accessToken,refreshToken},
    "login successfully"));
});

export { registerUser,
    loginUser
 };
