import Board from "../models/board.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createBoard = asyncHandler(async (req, res) => {
  const { name, project_id } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const board = await Board.create(req.body);
  res.status(201).json({ success: true, data: board });
});

export const getAllBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find().populate("project_id");
  res.json({ success: true, data: boards });
});

export const getBoardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const board = await Board.findById(id).populate("project_id");
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  res.json({ success: true, data: board });
});

export const updateBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
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
