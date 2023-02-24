import { Router } from "express";
import {
  getProjects,
  createProject,
  deleteProject,
  getProject,
} from "../controllers/projects.js";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.get("/:id", getProject);

export default router;