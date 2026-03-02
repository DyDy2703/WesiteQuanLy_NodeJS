import StatusType from "../models/statusType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * @route   POST /api/status-types/
 * @desc    Create a new status type
 * @body    { name, description }
 * @returns 201 Created | 404 Not Required | 409 Already Exists | 500 Internal Server Error
**/

export const createStatusType = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(404);
    throw new Error("name and description is required");
  }
  const exist = await StatusType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Status type already exists");
  }
  const type = await StatusType.create({ name, description });
  res.status(201).json({ success: true, data: type });
});


/**
 * @route   GET /api/status-types/
 * @desc    Get all status types
 * @body    { }
 * @returns 200 OK | 500 Internal Server Error
**/

export const getAllStatusTypes = asyncHandler(async (req, res) => {
  const types = await StatusType.find();
  res.json({ success: true, data: types });
});


/**
 * @route   GET /api/status-types/{statusTypeID}
 * @desc    Get status type by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

export const getStatusTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await StatusType.findById(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});


/**
 * @route   PUT /api/status-types/{statusTypeID}
 * @desc    Update status type by ID
 * @body    { name?, description? }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 409 Already Exists | 500 Internal Server Error
**/

export const updateStatusType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (!name && !description) {
    res.status(405);
    throw new Error("Bad Request");
  }
  const type = await StatusType.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }

  // Kiểm tra trùng name nếu đổi
  if (name && name !== type.name) {
    const exist = await StatusType.findOne({ name });
    if (exist) {
      res.status(409);
      throw new Error("Status type name already exists");
    }
  }

  type.name = name ?? type.name;
  type.description = description ?? type.description;
  await type.save();
  res.json({ success: true, data: type });
});


/**
 * @route   DELETE /api/status-types/{statusTypeID}
 * @desc    Delete status type (prevent if being used by issues)
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
**/

export const deleteStatusType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await StatusType.findByIdAndDelete(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }

  // Không cho xóa nếu đang được Issue sử dụng
  const issueUsing = await Issue.findOne({ status_type_id: id });
  if (issueUsing) {
    res.status(408);
    throw new Error("Status type is in use");
  }

  await type.deleteOne();
  res.json({ success: true, data: type });
});
