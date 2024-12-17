import Router from "express"
import {
    createMatch,
    getAllMatches,
    updateMatch,
    getMatchesByPinCode,
    getMatchesByCity,
    getMatchesByAddress,
    deleteMatch,
} from "../controllers/match.controller.js";

const router = Router();

router.route("/").post(createMatch);
router.route("/:id").put(updateMatch);
router.route("/").get(getAllMatches);
router.route("/:id").delete(deleteMatch);
router.route("/pincode/:pinCode").get(getMatchesByPinCode);
router.route("/city/:city").get(getMatchesByCity);
router.route("/address/:address").get(getMatchesByAddress);

export default router