import {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateCurrentUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getMatchHistory,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").get(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// sercured routes
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-user").put(verifyJWT, updateCurrentUserDetails);
router
  .route("/udpate-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/matchHistory").get(verifyJWT, getMatchHistory);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/logout").post(verifyJWT, logout);

export default router;
