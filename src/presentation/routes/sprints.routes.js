import express from "express";
import sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

router.post("/", sprintController.createSprint);
router.get("/", sprintController.getAllSprints);
router.get("/:id", sprintController.getSprintById);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

export default router;
