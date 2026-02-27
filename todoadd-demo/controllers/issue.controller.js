import Issue from "../models/issue.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createIssue = asyncHandler(async (req, res) => {
  const { issue_key, summary, project_id } = req.body;
  if (!issue_key || !summary || !project_id) {
    res.status(400);
    throw new Error("issue_key, summary, and project_id are required");
  }
  const existing = await Issue.findOne({ issue_key });
  if (existing) {
    res.status(409);
    throw new Error("Issue key already exists");
  }
  const issue = await Issue.create(req.body);
  res.status(201).json({ success: true, data: issue });
});

export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  res.json({ success: true, data: issues });
});

export const getIssueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const issue = await Issue.findById(id)
    .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }
  res.json({ success: true, data: issue });
});

export const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const issue = await Issue.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }
  res.json({ success: true, data: issue });
});

export const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const issue = await Issue.findByIdAndDelete(id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }
  res.json({ success: true, data: issue });
});
