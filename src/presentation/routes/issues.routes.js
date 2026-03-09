import express from "express";
import issueController from "../controllers/issue.controller.js";

const issuesRoutes = express.Router();

issuesRoutes.post("/", issueController.createIssue);
issuesRoutes.get("/", issueController.getAllIssues);
issuesRoutes.get("/:id", issueController.getIssueById);
issuesRoutes.put("/:id", issueController.updateIssue);
issuesRoutes.delete("/:id", issueController.deleteIssue);

export default issuesRoutes;