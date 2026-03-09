import express from "express";
import statusTypeController from "../controllers/statusType.controller.js";

const issueTypesRoutes = express.Router();

issueTypesRoutes.post("/", statusTypeController.createStatusType);
issueTypesRoutes.get("/", statusTypeController.getAllStatusTypes);
issueTypesRoutes.get("/:id", statusTypeController.getStatusTypeById);
issueTypesRoutes.put("/:id", statusTypeController.updateStatusType);
issueTypesRoutes.delete("/:id", statusTypeController.deleteStatusType);

export default issueTypesRoutes;
