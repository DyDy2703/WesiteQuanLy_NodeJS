import Issue from "../models/issue.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * @route   POST /api/issues/
 * @desc    Create a new issue   
 * @body    { issue_key, summary, description?, status_id, priority_id, type_id, project_id, reporter_id, assignee_id }
 * @returns 201 Created | 402 Not Required | 409 Already Exist | 500 Internal Server Error
**/

export const createIssue = asyncHandler(async (req, res) => {
  const { issue_key, summary, description, status_id, priority_id, type_id, project_id, reporter_id, assignee_id } = req.body;
  if (!issue_key || !summary || !status_id || !priority_id || !type_id || !project_id || !reporter_id || !assignee_id) {
    res.status(400);
    throw new Error("Fields are required");
  }
  const existing = await Issue.findOne({ issue_key });
  if (existing) {
    res.status(409);
    throw new Error("Issue key already exists");
  }
  const issue = await Issue.create(req.body);
  res.status(201).json({ success: true, data: issue });
});


/**
 * @route   GET /api/issues/
 * @desc    Get all issues
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("status_id priority_id type_id project_id reporter_id assignee_id");
  res.json({ success: true, data: issues });
});


/**
 * @route   GET /api/issues/{issueID}
 * @desc    Get all issues by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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


/**
 * @route   PUT /api/issues/{issueID}
 * @desc    Update issue by ID   
 * @body    { issue_key?, summary?, description?, status_id?, priority_id?, type_id?, project_id?, reporter_id?, assignee_id? }
 * @returns 200 OK | 400 Invalid ID | 404 Issue Not Found | 405 Bad Request | 406 Field Validate | 500 Internal Server Error
**/

export const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!body) {
    res.status(405);
    throw new Error("Bad Request");
  }
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const issue = await Issue.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }
  // ===== Validate foreign keys  =====
  if (body.status_id) {
    if (!validateObjectId(body.status_id)) {
      res.status(406);
      throw new Error("Validate status_id");
    }
  }
  if (body.priority_id) {
    if (!validateObjectId(body.priority_id)) {
      res.status(406);
      throw new Error("Validate priority_id");
    }
  }
   if (body.type_id) {
    if (!validateObjectId(body.type_id)) {
      res.status(406);
      throw new Error("Validate type_id");
    }
  }
   if (body.project_id) {
    if (!validateObjectId(body.project_id)) {
      res.status(406);
      throw new Error("Validate project_id");
    }
  }
  if (body.reporter_id) {
    if (!validateObjectId(body.reporter_id)) {
      res.status(406);
      throw new Error("Validate reporter_id");
    }
  }
  if (body.assignee_id) {
    if (!validateObjectId(body.assignee_id)) {
      res.status(406);
      throw new Error("Validate assignee_id");
    }
  }

  Object.assign(issue, body);
  await issue.save();
  res.json({ success: true, data: issue });
});


/**
 * @route   DELETE /api/issues/{issueID}
 * @desc    Delete issue by ID (and related comments)
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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

  // Xóa tất cả comment thuộc issue này
  await Comment.deleteMany({ issue_id: id });

  // Xóa issue
  await issue.deleteOne();

  res.json({ success: true, data: issue });
});
