import PriorityType from "../models/priorityType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createPriorityType = asyncHandler(async (req, res) => {
  const { name, level } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const exist = await PriorityType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Priority type already exists");
  }
  const type = await PriorityType.create({ name, level });
  res.status(201).json({ success: true, data: type });
});

export const getAllPriorityTypes = asyncHandler(async (req, res) => {
  const types = await PriorityType.find();
  res.json({ success: true, data: types });
});

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

export const updatePriorityType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
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
  res.json({ success: true, data: type });
});
