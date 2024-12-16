import jwt from "jsonwebtoken";
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

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { incomingRefreshToken } = req.body || req.cookies;

  if (!incomingRefreshToken)
    throw new ApiError(401, "Refresh token is required");

  try {
    const destructuedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    const user = await User.findById(destructuedRefreshToken._id);

    if (!user) return new ApiError(401, "Invalid refresh Token !");

    if (incomingRefreshToken !== user?.refreshToken)
      return new ApiError(401, "Token doesn't match or Expired !");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("refreshToken", newRefreshToken, options);
    res.cookie("accessToken", accessToken, options);

    return res
      .send(201)
      .json(
        new ApiResponse(
          200,
          accessToken,
          newRefreshToken,
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.log("Unable to verify refresh Tokens !");
    return new ApiError(401, "Unable to verify tokens");
  }
});

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
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(400, "Invalid userName or email");
  const isValidUser = await user.isCorrectPassword(password);
  if (!isValidUser) throw new ApiError(403, "Incorrect Password !");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  // we can directly save the token is current user , but to make more secure again take details without token and password
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshTiken"
  );

  const options = {
    httpOnly: true, // in production environment it can't be modified by the client side
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "login successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logout successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user details "));
});

const updateCurrentUserDetails = asyncHandler(async (req, res) => {
  const { fullName, username, email, phoneNo, gender } = req.body;

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(400, "User not found");

  if (fullName) user.fullName = fullName;
  if (username) user.username = username;
  if (email) user.email = email;
  if (phoneNo) user.phoneNo = phoneNo;
  if (gender) user.gender = gender;

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});
const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    throw new ApiError(400, "Provide current password and new password");

  if (currentPassword.length < 8)
    throw new ApiError(400, "Password must be at least 8 characters long");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User not found");

  const isValidPassword = await user.isCorrectPassword(currentPassword);
  if (!isValidPassword) throw new ApiError(400, "Incorrect current password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Password changed successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Please upload avatar");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url)
    throw new ApiError(500, "Something went wrong! Can't update avatar");

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: avatar.url },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(400, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
  } catch (error) {
    deleteFromCloudinary(avatar.public_id);
    throw new ApiError(500, "Something went wrong! Can't update avatar");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, avatar, "Avatar uploaded successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.path;

  if (!coverImageLocalPath)
    throw new ApiError(400, "Please upload cover image");

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url)
    throw new ApiError(500, "Something went wrong! Can't update cover image");

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { coverImage: coverImage.url } },
      { new: true }
    ).select("-password -refreshToken");
    if (!user) throw new ApiError(400, "User not found");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Cover image updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong! Can't update cover image"
    );
  }
});

const getMatchHistory = asyncHandler(async (req, res) => {
  // using aggregation pipeline to get match history
  const matchHistory = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user?._id) } },
    {
      $lookup: {
        from: "matches",
        localField: "matchHistory",
        foreignField: "_id",
        as: "matchHistory",
        pipeline: [
          {
            $lookup: {
              from: "locations",
              localField: "location",
              foreignField: "_id",
              as: "matchLocation",
              pipeline: [
                {
                  $project: {
                    address: 1,
                    city: 1,
                    pincode: 1,
                    state: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              location: {
                $first: "$matchLocation",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!matchHistory) throw new ApiError(402, "User have no match history");
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        matchHistory,
        "user match history is loaded successfully"
      )
    );
});

export { 
  registerUser, 
  loginUser, 
  refreshAccessToken, 
  logout , 
  getCurrentUser,
  generateAccessTokenAndRefreshToken,
  updateCurrentUserDetails,
  changeCurrentUserPassword,
  updateUserAvatar,
  updateUserCoverImage,
  getMatchHistory
};
