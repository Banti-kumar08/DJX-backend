import { Router } from "express";
import {
    userRegister,
    userLogin,
    userLogout,
    refreshAccessToken,
    getCurrentUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", verifyJWT, userLogout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
