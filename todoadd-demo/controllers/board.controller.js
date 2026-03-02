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
  if (project_id !== undefined && project_id !== null && project_id !== "" && !validateObjectId(project_id)) {
    res.status(400);
    throw new Error("project_id must be a valid ObjectId");
  }
  const board = await Board.create({ name, project_id });
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
