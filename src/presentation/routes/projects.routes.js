import express from "express";
import projectController from "../controllers/project.controller.js";

const projectsRoutes = express.Router();

projectsRoutes.post("/", projectController.createProject);
projectsRoutes.get("/", projectController.getAllProjects);
projectsRoutes.get("/:id", projectController.getProjectById);
projectsRoutes.put("/:id", projectController.updateProject);
projectsRoutes.delete("/:id", projectController.deleteProject);

export default projectsRoutes;
