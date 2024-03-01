import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/user.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
