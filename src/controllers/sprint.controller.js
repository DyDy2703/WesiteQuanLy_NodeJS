import Sprint from "../models/sprint.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/sprints/
 * @desc    Create a new sprint   
 * @body    { name, project_id, start_date?, end_date?, status? }
 * @returns 201 OK | 400 Not Required | 404 Not Found | 500 Internal Server Error
**/

export const createSprint = asyncHandler(async (req, res) => {
  const { name, project_id } = req.body;
  if (!name || !project_id) {
    res.status(400);
    throw new Error("name and project_id is required");
  }
  const sprint = await Sprint.create(req.body);
  res.status(201).json({ success: true, data: sprint });
});

/**
 * @route   GET /api/sprints/
 * @desc    Get all sprints
 * @body    { }
 * @returns 200 OK | 404 Not Found | 500 Internal Server Error
**/

export const getAllSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find().populate("project_id");
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
  const sprint = await Sprint.findById(id).populate("project_id");
  if (!sprint) {
    res.status(404);
    throw new Error("Sprint not found");
  }
  res.json({ success: true, data: sprint });
});


/**
 * @route   PUT /api/sprints/{sprintID}
 * @desc    Update sprint by ID   
 * @body    { name?, project_id?, start_date?, end_date?, status? }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
**/

export const updateSprint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (!body) {
    res.status(405);
    throw new Error("Bad Request ");
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

/**
 * @route   DELETE /api/sprints/{sprintID}
 * @desc    Delete sprint by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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
