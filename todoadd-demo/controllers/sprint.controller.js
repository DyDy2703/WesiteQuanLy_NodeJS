import Sprint from "../models/sprint.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createSprint = asyncHandler(async (req, res) => {
  const { name, board_id } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const sprint = await Sprint.create(req.body);
  res.status(201).json({ success: true, data: sprint });
});

export const getAllSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find().populate("board_id");
  res.json({ success: true, data: sprints });
});

export const getSprintById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const sprint = await Sprint.findById(id).populate("board_id");
  if (!sprint) {
    res.status(404);
    throw new Error("Sprint not found");
  }
  res.json({ success: true, data: sprint });
});

export const updateSprint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const sprint = await Sprint.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!sprint) {
    res.status(404);
    throw new Error("Sprint not found");
  }
  res.json({ success: true, data: sprint });
});

export const deleteSprint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const sprint = await Sprint.findByIdAndDelete(id);
  if (!sprint) {
    res.status(404);
    throw new Error("Sprint not found");
  }
  res.json({ success: true, data: sprint });
});
