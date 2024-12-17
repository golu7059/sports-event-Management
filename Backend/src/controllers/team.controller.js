import Team from "../models/team.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"; // Ensure asyncHandler is implemented or imported
import {isValidId} from "../middlewares/isvalidObjectId.middleware.js";

// Create Team
const createTeam = asyncHandler(async (req, res) => {
    const { name: teamName, category, members, teamLeader, matchId } = req.body;

    if (!teamName || !category || !members || !teamLeader || !matchId) {
        throw new ApiError(400, "All fields are required");
    }

    // validation for the object must be match in the database
    if(!isValidId(teamLeader)) throw new ApiError(401 , "Invalid team leader id");
    if(!isValidId(matchId)) throw new ApiError(401 , "Invalid match id");
    if(!members?.every(isValidId)) throw new ApiError(401 , "Invalid members id");

    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) throw new ApiError(400, "Team name already exists");

    const team = await Team.create({
        name: teamName,
        category,
        members,
        teamLeader,
        matchId,
    });

    res.status(201).json(new ApiResponse(201, team, "Team created successfully"));
});

// Update Team
const updateTeam = asyncHandler(async (req, res) => {
    
    const { name: teamName, category, members, teamLeader, matchId } = req.body;
    if(teamLeader && !isValidId(teamLeader)) throw new ApiError(401 , "Invalid team leader id");
    if(matchId && !isValidId(matchId)) throw new ApiError(401 , "Invalid match id");

    const team = await Team.findByIdAndUpdate(
        req.params.id,
        { name: teamName, category, members, teamLeader, matchId },
        { new: true }
    );

    if (!team) throw new ApiError(404, "Team not found");

    res.status(200).json(new ApiResponse(200, team, "Team updated successfully"));
});

// Get All Teams by Match ID
const getAllTeams = asyncHandler(async (req, res) => {
    const matchId = req.params.matchId;

    if (!matchId) throw new ApiError(400, "Match ID is required");
    if(!isValidId(matchId)) throw new ApiError(401 , "Invalid match id");

    const teams = await Team.find({ matchId });

    if (teams.length === 0) throw new ApiError(404, "No teams found");

    res.status(200).json(new ApiResponse(200, teams, "Teams found successfully"));
});

export { createTeam, updateTeam, getAllTeams };
