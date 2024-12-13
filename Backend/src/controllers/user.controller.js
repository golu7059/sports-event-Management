import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password, gender, phoneNo } = req.body;

    // Validate required fields
    const requiredFields = { fullName, email, password, username, gender, phoneNo };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (typeof value !== 'string' || value.trim() === "") {
            throw new ApiError(400, `${key} is required and must be a non-empty string.`);
        }
    }

    // Additional validations
    console.log(password)
    if (fullName.length <= 2) throw new ApiError(400, "Full name should be at least 3 characters");
    if (password.length < 8) throw new ApiError(400, "Password should be at least 8 characters");

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) throw new ApiError(401, "User already exists");

    // Validate file uploads
    if (!req.files || !req.files.avatar?.[0]?.path) {
        throw new ApiError(400, "Avatar image is required");
    }
    const avatarLocalPath = req.files.avatar[0].path;
    const coverImageLocalPath = req.files.coverImage?.[0]?.path;

    // Upload files to Cloudinary
    console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : "";

    // Create new user
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        phoneNo,
        gender,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Something went wrong! Can't save details");

    // Return response
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export { registerUser };
