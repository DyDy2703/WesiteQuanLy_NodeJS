import express from "express";
import priorityTypeController from "../controllers/priorityType.controller.js";

const priorityTypesRoutes = express.Router();

priorityTypesRoutes.post("/", priorityTypeController.createPriorityType);
priorityTypesRoutes.get("/", priorityTypeController.getAllPriorityTypes);
priorityTypesRoutes.get("/:id", priorityTypeController.getPriorityTypeById);
priorityTypesRoutes.put("/:id", priorityTypeController.updatePriorityType);
priorityTypesRoutes.delete("/:id", priorityTypeController.deletePriorityType);

export default priorityTypesRoutes;
