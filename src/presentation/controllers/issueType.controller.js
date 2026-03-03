import IssueType from "../models/issueType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * @route   POST /api/issue-types/
 * @desc    Create a new issue type
 * @body    { name }
 * @returns 201 Created | 400 Bad Request | 409 Already Exists | 500 Internal Server Error
**/

export const createIssueType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const exist = await IssueType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Issue type already exists");
  }
  const type = await IssueType.create({ name });
  res.status(201).json({ success: true, data: type });
});


/**
 * @route   GET /api/issue-types/
 * @desc    Get all issue types
 * @body    { }
 * @returns 200 OK | 500 Internal Server Error
**/

export const getAllIssueTypes = asyncHandler(async (req, res) => {
  const types = await IssueType.find();
  res.json({ success: true, data: types });
});


/**
 * @route   GET /api/issue-types/{issueTypeID}
 * @desc    Get issue type by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

export const getIssueTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await IssueType.findById(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});


/**
 * @route   PUT /api/issue-types/{issueTypeID}
 * @desc    Update issue type by ID
 * @body    { name }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 409 Already Exists | 500 Internal Server Error
**/

export const updateIssueType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(405);
    throw new Error("Bad Request");
  }
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await IssueType.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }

  // Kiểm tra trùng name nếu đổi tên
  if (name && name !== type.name) {
    const exist = await IssueType.findOne({ name });
    if (exist) {
      res.status(409);
      throw new Error("Issue type name already exists");
    }
  }

  type.name = name ?? type.name;

  await type.save();
  res.json({ success: true, data: type });
});


/**
 * @route   DELETE /api/issue-types/{issueTypeID}
 * @desc    Delete issue type (prevent if being used by issues)
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
**/

export const deleteIssueType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await IssueType.findByIdAndDelete(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  
  // Không cho xóa nếu đang được Issue sử dụng
  const issueUsing = await Issue.findOne({ issue_type_id: id });
  if (issueUsing) {
    res.status(409);
    throw new Error("Issue type is in use");
  }

  await type.deleteOne();
  res.json({ success: true, data: type });
});
