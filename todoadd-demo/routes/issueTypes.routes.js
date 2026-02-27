import express from "express";
import {
  createIssueType,
  getAllIssueTypes,
  getIssueTypeById,
  updateIssueType,
  deleteIssueType,
} from "../controllers/issueType.controller.js";

const router = express.Router();

router.post("/", createIssueType);
router.get("/", getAllIssueTypes);
router.get("/:id", getIssueTypeById);
router.put("/:id", updateIssueType);
router.delete("/:id", deleteIssueType);

export default router;
