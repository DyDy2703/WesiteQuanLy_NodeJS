import PriorityType from "../models/priorityType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * @route   POST /api/priority-types/
 * @desc    Create a new priority type
 * @body    { name, level }
 * @returns 201 Created | 400 Not Required | 409 Already Exists | 500 Internal Server Error
**/

export const createPriorityType = asyncHandler(async (req, res) => {
  const { name, level } = req.body;
  if (!name || !level) {
    res.status(400);
    throw new Error("name and level is required");
  }
  const exist = await PriorityType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Priority type already exists");
  }
  const type = await PriorityType.create({ name, level });
  res.status(201).json({ success: true, data: type });
});


/**
 * @route   GET /api/priority-types/
 * @desc    Get all priority types
 * @body    {  }
 * @returns 200 OK | 500 Internal Server Error
**/

export const getAllPriorityTypes = asyncHandler(async (req, res) => {
  const types = await PriorityType.find();
  res.json({ success: true, data: types });
});


/**
 * @route   GET /api/priority-types/{priorityTypeID}
 * @desc    Get priority type by ID
 * @body    {  }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

export const getPriorityTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await PriorityType.findById(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});


/**
 * @route   PUT /api/priority-types/{priorityTypeID}
 * @desc    Update priority type by ID
 * @body    { name, level }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 409 Name Exists | 500 Internal Server Error
**/

export const updatePriorityType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;
  if (!name && !level) {
    res.status(405);
    throw new Error("Bad Request");
  }
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }

  // Kiểm tra trùng name (nếu đổi name)
  if (name && name !== type.name) {
    const exist = await PriorityType.findOne({ name });
    if (exist) {
      res.status(409);
      throw new Error("Priority type name already exists");
    }
  }

  const type = await PriorityType.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});


/**
 * @route   DELETE /api/priority-types/{priorityTypeID}
 * @desc    Delete priority type (prevent if being used by issues)
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
**/

export const deletePriorityType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await PriorityType.findByIdAndDelete(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  // Không cho xóa nếu đang được Issue sử dụng
  const issueUsing = await Issue.findOne({ priority_type_id: id });
  if (issueUsing) {
    res.status(408);
    throw new Error("Priority type is in use");
  }

  await type.deleteOne();
  res.json({ success: true, data: type });
});
