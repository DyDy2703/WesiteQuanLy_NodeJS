import express from "express";
import issueTypeController from "../controllers/issueType.controller.js";

const router = express.Router();

router.post("/", issueTypeController.createIssueType);
router.get("/", issueTypeController.getAllIssueTypes);
router.get("/:id", issueTypeController.getIssueTypeById);
router.put("/:id", issueTypeController.updateIssueType);
router.delete("/:id", issueTypeController.deleteIssueType);

export default router;
