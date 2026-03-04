import express from "express";
import priorityTypeController from "../controllers/priorityType.controller.js";

const router = express.Router();

router.post("/", priorityTypeController.createPriorityType);
router.get("/", priorityTypeController.getAllPriorityTypes);
router.get("/:id", priorityTypeController.getPriorityTypeById);
router.put("/:id", priorityTypeController.updatePriorityType);
router.delete("/:id", priorityTypeController.deletePriorityType);

export default router;
