import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id); // if write in one line then return,{} not required
}

 const isValidIdMiddleware = (req, res, next) => {
    const id = req.params.id || req.body.id;
    if (!id || !isValidObjectId(id)) {
        throw new ApiError(400, "Invalid object id");
    }
    next();
}

export {
    isValidId,
    isValidIdMiddleware
} 