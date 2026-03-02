import Board from "../models/board.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/boards/
 * @desc    Create a new board   
 * @body    { name, user_id }
 * @returns 201 OK | 400 Not Required | 409 Exist | 500 Internal Server Error
**/

export const createBoard = asyncHandler(async (req, res) => {
  const { name, user_id } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  if (project_id !== undefined && project_id !== null && project_id !== "" && !validateObjectId(project_id)) {
    res.status(400);
    throw new Error("project_id must be a valid ObjectId");
  }
  const board = await Board.create({ name, project_id });
  res.status(201).json({ success: true, data: board });
});

/**
 * @route   GET /api/boards/
 * @desc    Get all issues
 * @body    { }
 * @returns 200 OK | 400 ID Not Found | 404 Not Found | 500 Internal Server Error
**/

export const getAllBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find().populate("user_id");
  res.json({ success: true, data: boards });
});

/**
 * @route   GET /api/boards/{boardID}
 * @desc    Get all boards by ID
 * @body    { }
 * @returns 200 OK | 400 ID Not Found | 404 Not Found | 500 Internal Server Error
**/

export const getBoardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const board = await Board.findById(id).populate("user_id");
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  res.json({ success: true, data: board });
});

/**
 * @route   POST /api/boards/{boardID}
 * @desc    Update board by ID   
 * @body    { name, user_id }
 * @returns 200 OK | 400 ID Not Found | 404 Board Not Found | 500 Internal Server Error
**/

export const updateBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, project_id } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (project_id !== undefined) updateFields.project_id = project_id;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  if (
    updateFields.project_id !== undefined &&
    updateFields.project_id !== null &&
    updateFields.project_id !== "" &&
    !validateObjectId(updateFields.project_id)
  ) {
    res.status(400);
    throw new Error("project_id must be a valid ObjectId");
  }

  const board = await Board.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  res.json({ success: true, data: board });
});

export const deleteBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const board = await Board.findByIdAndDelete(id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  res.json({ success: true, data: board });
});
