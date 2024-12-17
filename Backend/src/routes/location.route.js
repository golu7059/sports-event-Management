import { createLocation , deleteLocation, updateLocation } from "../controllers/location.controller.js";
import Router from 'express'

const router = Router()

router.route("/").post(createLocation)
router.route("/:id").put(updateLocation)
router.route("/:id").delete(deleteLocation)

export default router