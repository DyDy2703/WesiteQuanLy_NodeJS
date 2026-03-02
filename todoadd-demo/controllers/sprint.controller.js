import Sprint from "../models/sprint.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createSprint = asyncHandler(async (req, res) => {
  const { name, board_id, start_date, end_date, status } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  if (board_id !== undefined && board_id !== null && board_id !== "" && !validateObjectId(board_id)) {
    res.status(400);
    throw new Error("board_id must be a valid ObjectId");
  }
  if (start_date && Number.isNaN(Date.parse(start_date))) {
    res.status(400);
    throw new Error("start_date must be a valid date");
  }
  if (end_date && Number.isNaN(Date.parse(end_date))) {
    res.status(400);
    throw new Error("end_date must be a valid date");
  }
  const sprint = await Sprint.create({ name, board_id, start_date, end_date, status });
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
  const { name, board_id, start_date, end_date, status } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (board_id !== undefined) updateFields.board_id = board_id;
  if (start_date !== undefined) updateFields.start_date = start_date;
  if (end_date !== undefined) updateFields.end_date = end_date;
  if (status !== undefined) updateFields.status = status;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  if (
    updateFields.board_id !== undefined &&
    updateFields.board_id !== null &&
    updateFields.board_id !== "" &&
    !validateObjectId(updateFields.board_id)
  ) {
    res.status(400);
    throw new Error("board_id must be a valid ObjectId");
  }
  if (updateFields.start_date && Number.isNaN(Date.parse(updateFields.start_date))) {
    res.status(400);
    throw new Error("start_date must be a valid date");
  }
  if (updateFields.end_date && Number.isNaN(Date.parse(updateFields.end_date))) {
    res.status(400);
    throw new Error("end_date must be a valid date");
  }

  const sprint = await Sprint.findByIdAndUpdate(id, updateFields, {
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
