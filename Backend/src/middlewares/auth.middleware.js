import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const incomingAccessToken =
        req.cookies.accessToken ||
        req.body.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingAccessToken) return new ApiError(401, "Unauthorized user !");

    try {
        const destructuedAccessToken = jwt.verify(
            incomingAccessToken,
            process.env.ACCESS_TOKEN_KEY
        );
        const userId = destructuedAccessToken._id;
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) return new ApiError(401, "Unauthorized user !");
        req.user = user;
        next();

    } catch (error) {
        console.log("unable to verify access token");
        throw new ApiError(401, error?.message || "unauthorized access token !");
    }
});

export { verifyJWT };
