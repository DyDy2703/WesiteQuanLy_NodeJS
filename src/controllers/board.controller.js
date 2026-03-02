import Board from "../models/board.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/boards/
 * @desc    Create a new board   
 * @body    { name, user_id }
 * @returns 201 Created | 402 Not Required | 409 Already Exist | 500 Internal Server Error
**/

export const createBoard = asyncHandler(async (req, res) => {
  const { name, user_id } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const existing = await Issue.findOne({ name });
  if (existing) {
    res.status(409);
    throw new Error("Name already exists");
  }
  // ===== Validate foreign keys  =====
  if (user_id) {
    if (!validateObjectId(user_id)) {
      res.status(406);
      throw new Error("Validate user_id");
    }
  }
  const board = await Board.create(req.body);
  res.status(201).json({ success: true, data: board });
});

/**
 * @route   GET /api/boards/
 * @desc    Get all issues
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

export const getAllBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find().populate("user_id");
  res.json({ success: true, data: boards });
});

/**
 * @route   GET /api/boards/{boardID}
 * @desc    Get all boards by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
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
 * @route   PUT /api/boards/{boardID}
 * @desc    Update board by ID   
 * @body    { name?, user_id? }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
**/

export const updateBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, user_id } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (!name && !user_id) {
    res.status(405);
    throw new Error("Bad Request");
  }
  const board = await Board.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  res.json({ success: true, data: board });
});


/**
 * @route   DELETE /api/boards/{boardID}
 * @desc    Delete comment by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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
