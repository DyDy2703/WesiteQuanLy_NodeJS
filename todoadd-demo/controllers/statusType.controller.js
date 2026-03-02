import StatusType from "../models/statusType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createStatusType = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const exist = await StatusType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Status type already exists");
  }
  const type = await StatusType.create({ name, description });
  res.status(201).json({ success: true, data: type });
});

export const getAllStatusTypes = asyncHandler(async (req, res) => {
  const types = await StatusType.find();
  res.json({ success: true, data: types });
});

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

export const updateStatusType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  const type = await StatusType.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});

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
  res.json({ success: true, data: type });
});
