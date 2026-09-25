import { Router } from "express";
import {
  createProject,
  getProjects,
} from "../controllers/projects.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/createproject", verifyJWT, createProject);
router.get("/getprojects", verifyJWT, getProjects);

export default router;
