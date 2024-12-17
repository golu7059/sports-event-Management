import Router from "express";
import {
  createTeam,
  getAllTeams,
  updateTeam,
} from "../controllers/team.controller.js";

const router = Router();

router.route("/").post(createTeam);
router.route("/:matchId").put(updateTeam);
router.route("/:matchId").get(getAllTeams);

export default router;
