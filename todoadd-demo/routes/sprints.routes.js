import express from "express";
import {
  createSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprint.controller.js";

const router = express.Router();

router.post("/", createSprint);
router.get("/", getAllSprints);
router.get("/:id", getSprintById);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);

export default router;
