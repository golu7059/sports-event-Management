import { Location } from "../models/location.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLocation = asyncHandler(async (req, res) => {
    const { address, city, state, pincode } = req.body;
    if(!address || !city || !state || !pincode) throw new ApiError(400, "All fields are required");
    if(pincode.length !== 6) throw new ApiError(400, "Pincode should be of 6 digits");

    const location = await Location.create({ address, city, state, pincode });
    if(!location) throw new ApiError(400, "Location not created");

    res.status(201).json(new ApiResponse(201, location, "Location created successfully"));
});

const updateLocation = asyncHandler(async (req, res) => {
    const { address, city, state, pincode } = req.body;
    if(!address || !city || !state || !pincode) throw new ApiError(400, "All fields are required");

    if(pincode.length !== 6) throw new ApiError(400, "Pincode should be of 6 digits")
    const location = await Location.findByIdAndUpdate(
        req.params?.id,
        { address, city, state, pincode },
        { new: true }
    );

    if (!location) throw new ApiError(404, "Location not found");

    res.status(200).json(new ApiResponse(200, location, "Location updated successfully"));
});

const deleteLocation = asyncHandler(async (req, res) => {
    const id = req.params.id || req.body.id;
    if (!id) throw new ApiError(400, "Cannot get location id!");

    const location = await Location.findByIdAndDelete(id);
    if (!location) throw new ApiError(404, "Location not found");

    return res.status(200).json(new ApiResponse(200, {}, "Location deleted successfully"));
});

export {
    createLocation,
    updateLocation,
    deleteLocation
}