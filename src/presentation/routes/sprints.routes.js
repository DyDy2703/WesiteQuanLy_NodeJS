import express from "express";
import sprintController from "../controllers/sprint.controller.js";

const sprintRouters = express.Router();

sprintRouters.post("/", sprintController.createSprint);
sprintRouters.get("/", sprintController.getAllSprints);
sprintRouters.get("/:id", sprintController.getSprintById);
sprintRouters.put("/:id", sprintController.updateSprint);
sprintRouters.delete("/:id", sprintController.deleteSprint);

export default sprintRouters;
