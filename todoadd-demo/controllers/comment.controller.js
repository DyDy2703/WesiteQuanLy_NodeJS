import Comment from "../models/comment.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createComment = asyncHandler(async (req, res) => {
  const { issue_id, user_id, content } = req.body;
  if (!issue_id || !user_id || !content) {
    res.status(400);
    throw new Error("issue_id, user_id and content are required");
  }
  if (!validateObjectId(issue_id) || !validateObjectId(user_id)) {
    res.status(400);
    throw new Error("issue_id and user_id must be valid ObjectId");
  }
  const comment = await Comment.create({ issue_id, user_id, content });
  res.status(201).json({ success: true, data: comment });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("issue_id user_id");
  res.json({ success: true, data: comments });
});

export const getCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const comment = await Comment.findById(id).populate("issue_id user_id");
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.json({ success: true, data: comment });
});

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (content === undefined || String(content).trim() === "") {
    res.status(400);
    throw new Error("content is required");
  }
  const comment = await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true, runValidators: true }
  );
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.json({ success: true, data: comment });
});
