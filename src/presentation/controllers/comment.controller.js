import Comment from "../models/comment.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/comments/
 * @desc    Create a new comment   
 * @body    { issue_id, user_id, content }
 * @returns 201 Created | 402 Not Required | 500 Internal Server Error
**/
export const createComment = asyncHandler(async (req, res) => {
  const { issue_id, user_id, content } = req.body;
  if (!issue_id || !user_id || !content) {
    res.status(404);
    throw new Error("issue_id, user_id and content are required");
  }
  const comment = await Comment.create(req.body);
  res.status(201).json({ success: true, data: comment });
});


/**
 * @route   GET /api/comments/
 * @desc    Get all comments
 * @body    { }
 * @returns 200 OK | 500 Internal Server Error
**/

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("issue_id user_id");
  res.json({ success: true, data: comments });
});


/**
 * @route   GET /api/comments/{commentID}
 * @desc    Get comment by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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

/**
 * @route   PUT /api/comments/{commentID}
 * @desc    Update comment by ID   
 * @body    { issue_id?, user_id?, content? }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 406 Field Validate | 500 Internal Server Error
**/

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { issue_id, user_id, content } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (!issue_id && !user_id && !content) {
    res.status(405);
    throw new Error("Bad Request");
  }
  const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  // ===== Validate foreign keys  =====
  if (issue_id) {
    if (!validateObjectId(issue_id)) {
      res.status(406);
      throw new Error("Validate issue_id");
    }
  }
  if (user_id) {
    if (!validateObjectId(user_id)) {
      res.status(406);
      throw new Error("Validate user_id");
    }
  }

  res.json({ success: true, data: comment });
});


/**
 * @route   DELETE /api/comments/{commentID}
 * @desc    Delete comment by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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
