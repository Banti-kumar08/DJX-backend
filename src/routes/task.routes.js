import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addtask", verifyJWT, createTask);
router.get("/gettasks", verifyJWT, getTasks);
router.get("/gettask/:id", verifyJWT, getTaskById);
router.patch("/updatetask/:id", verifyJWT, updateTask);
router.delete("/deletetask/:id", verifyJWT, deleteTask);

export default router;
