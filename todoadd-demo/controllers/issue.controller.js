import Issue from "../models/issue.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const issueIdFields = ["status_id", "priority_id", "type_id", "project_id", "reporter_id", "assignee_id"];

const validateIssueBodyObjectIds = (payload) => {
  for (const field of issueIdFields) {
    const value = payload[field];
    if (value !== undefined && value !== null && value !== "" && !validateObjectId(value)) {
      return field;
    }
  }
  return null;
};

export const createIssue = asyncHandler(async (req, res) => {
  const {
    issue_key,
    summary,
    description,
    status_id,
    priority_id,
    type_id,
    project_id,
    reporter_id,
    assignee_id,
    due_at,
  } = req.body;

  if (!issue_key || !summary || !project_id) {
    res.status(400);
    throw new Error("issue_key, summary, and project_id are required");
  }

  const invalidField = validateIssueBodyObjectIds({
    status_id,
    priority_id,
    type_id,
    project_id,
    reporter_id,
    assignee_id,
  });
  if (invalidField) {
    res.status(400);
    throw new Error(`${invalidField} must be a valid ObjectId`);
  }

  if (due_at && Number.isNaN(Date.parse(due_at))) {
    res.status(400);
    throw new Error("due_at must be a valid date");
  }

  const existing = await Issue.findOne({ issue_key });
  if (existing) {
    res.status(409);
    throw new Error("Issue key already exists");
  }

  const issue = await Issue.create({
    issue_key,
    summary,
    description,
    status_id,
    priority_id,
    type_id,
    project_id,
    reporter_id,
    assignee_id,
    due_at,
  });
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
  const {
    issue_key,
    summary,
    description,
    status_id,
    priority_id,
    type_id,
    project_id,
    reporter_id,
    assignee_id,
    due_at,
  } = req.body;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }

  const updateFields = {};
  if (issue_key !== undefined) updateFields.issue_key = issue_key;
  if (summary !== undefined) updateFields.summary = summary;
  if (description !== undefined) updateFields.description = description;
  if (status_id !== undefined) updateFields.status_id = status_id;
  if (priority_id !== undefined) updateFields.priority_id = priority_id;
  if (type_id !== undefined) updateFields.type_id = type_id;
  if (project_id !== undefined) updateFields.project_id = project_id;
  if (reporter_id !== undefined) updateFields.reporter_id = reporter_id;
  if (assignee_id !== undefined) updateFields.assignee_id = assignee_id;
  if (due_at !== undefined) updateFields.due_at = due_at;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  const invalidField = validateIssueBodyObjectIds(updateFields);
  if (invalidField) {
    res.status(400);
    throw new Error(`${invalidField} must be a valid ObjectId`);
  }

  if (updateFields.due_at && Number.isNaN(Date.parse(updateFields.due_at))) {
    res.status(400);
    throw new Error("due_at must be a valid date");
  }

  const issue = await Issue.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
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
