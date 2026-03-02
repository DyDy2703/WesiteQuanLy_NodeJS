import express from "express";
import {
  createPriorityType,
  getAllPriorityTypes,
  getPriorityTypeById,
  updatePriorityType,
  deletePriorityType,
} from "../controllers/priorityType.controller.js";

const router = express.Router();

router.post("/", createPriorityType);
router.get("/", getAllPriorityTypes);
router.get("/:id", getPriorityTypeById);
router.put("/:id", updatePriorityType);
router.delete("/:id", deletePriorityType);

export default router;
