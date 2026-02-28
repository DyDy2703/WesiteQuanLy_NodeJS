import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "../controllers/issue.controller.js";

const router = express.Router();

router.post("/", createIssue);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

export default router;
