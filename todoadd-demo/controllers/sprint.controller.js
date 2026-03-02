import Sprint from "../models/sprint.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/sprints/
 * @desc    Create a new sprint   
 * @body    { name, board_id?, start_date?, end_date?, status? }
 * @returns 201 OK | 400 Not Required | 404 Not Found | 500 Internal Server Error
**/

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

/**
 * @route   GET /api/sprints/
 * @desc    Get all sprints
 * @body    { }
 * @returns 200 OK | 404 Not Found | 500 Internal Server Error
**/

export const getAllSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find().populate("board_id");
  res.json({ success: true, data: sprints });
});

/**
 * @route   GET /api/sprints/{sprintID}
 * @desc    Get all sprints by ID
 * @body    { }
 * @returns 200 OK | 400 ID Not Found | 404 Not Found | 500 Internal Server Error
**/

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


/**
 * @route   Post /api/sprints/{sprintID}
 * @desc    Update sprint by ID   
 * @body    { name, board_id?, start_date?, end_date?, status? }
 * @returns 200 OK | 400 ID Not Found | 404 User Not Found | 500 Internal Server Error
**/

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
