import { Match } from "../models/match.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isValidId } from "../middlewares/isvalidObjectId.middleware.js";

// create a match
const createMatch = asyncHandler(async (req, res) => {
  const {
    location,
    category,
    numberOfPlayers,
    teams,
    time,
    isPaid,
    organiser,
    paymentOptions,
  } = req.body;

  if (!location || !category || !numberOfPlayers || !isPaid)
    throw new ApiError(400, "Fill compulsory fields");
  if (!isValidId(location))
    throw new ApiError(401, "Please create locatioj first !");
  if (!teams?.every(isValidId)) throw new ApiError(401, "Invalid team id");
  if (!isValidId(organiser)) throw new ApiError(401, "Invalid organiser");

  const match = await Match.create({
    location,
    category,
    numberOfPlayers,
    teams,
    time,
    isPaid,
    organiser,
    paymentOptions,
  });
  if (!match) throw new ApiError(401, "unale to create a match");

  return res
    .status(200)
    .json(new ApiResponse(201, match,"match crated successfully"));
});

const updateMatch = asyncHandler(async (req, res) => {
  const matchId = req.params?.id;
  if (!matchId) throw new ApiError(401, "Match id is required !");
  const {
    location,
    category,
    numberOfPlayers,
    teams,
    time,
    isPaid,
    organiser,
    paymentOptions,
  } = req.body;

  const match = await Match.findByIdAndUpdate(
    matchId,
    {
      location,
      category,
      numberOfPlayers,
      teams,
      time,
      isPaid,
      organiser,
      paymentOptions,
    },
    {
      new: true,
    }
  );
  if(!match) throw new ApiError(401,match,"can't update match !");

  return res.status(200).json(new ApiResponse(200,match,"Match details updated successfully"))
});

// delete a match
const deleteMatch = asyncHandler(async (req, res) => {
  const matchId = req.params?.id;

  try {
    const match = await Match.findByIdAndDelete(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    return res.status(200).json(new ApiResponse(200, match, "Match deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong! Can't delete match");
  }
});
// Fetch all matches
const getAllMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find();

  if (matches.length === 0) throw new ApiError(404, "No matches found");

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches found successfully"));
});

// Fetch matches by PIN code
const getMatchesByPinCode = asyncHandler(async (req, res) => {
  const pinCode = req.params.pinCode;
  if (!pinCode) throw new ApiError(400, "PinCode is required");

  const matches = await Match.aggregate([
    {
      $lookup: {
        from: "locations", // Collection name in MongoDB (lowercase + pluralized)
        localField: "location",
        foreignField: "_id",
        as: "locationDetails",
      },
    },
    { $unwind: "$locationDetails" },
    {
      $match: { "locationDetails.pincode": Number(pinCode) }, // Ensure pinCode is a number
    },
  ]);

  if (matches.length === 0) throw new ApiError(404, "No matches found");

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches found successfully"));
});

// Fetch matches by city name
const getMatchesByCity = asyncHandler(async (req, res) => {
  const city = req.params.city;

  const matches = await Match.aggregate([
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "locationDetails",
      },
    },
    { $unwind: "$locationDetails" },
    {
      $match: {
        "locationDetails.city": { $regex: city, $options: "i" }, // Case-insensitive partial match
      },
    },
  ]);

  if (matches.length === 0) throw new ApiError(404, "No matches found");

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches found successfully"));
});

// Fetch matches by address
const getMatchesByAddress = asyncHandler(async (req, res) => {
  const address = req.params.address;

  const matches = await Match.aggregate([
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "locationDetails",
      },
    },
    { $unwind: "$locationDetails" },
    {
      $match: {
        "locationDetails.address": { $regex: address, $options: "i" }, // Case-insensitive partial match
      },
    },
  ]);

  if (matches.length === 0) throw new ApiError(404, "No matches found");

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches found successfully"));
});

export {
  createMatch,
  updateMatch,
  deleteMatch,
  getAllMatches,
  getMatchesByPinCode,
  getMatchesByCity,
  getMatchesByAddress,
};
