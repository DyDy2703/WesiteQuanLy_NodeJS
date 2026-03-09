import express from "express";
import issueTypeController from "../controllers/issueType.controller.js";

const issueTypesRoutes = express.Router();

issueTypesRoutes.post("/", issueTypeController.createIssueType);
issueTypesRoutes.get("/", issueTypeController.getAllIssueTypes);
issueTypesRoutes.get("/:id", issueTypeController.getIssueTypeById);
issueTypesRoutes.put("/:id", issueTypeController.updateIssueType);
issueTypesRoutes.delete("/:id", issueTypeController.deleteIssueType);

export default issueTypesRoutes;
