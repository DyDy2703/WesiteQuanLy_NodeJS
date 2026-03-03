import commentService from "../../business/services/comment.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(req.body);
  res.status(201).json({ success: true, data: comment });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getAllComments();
  res.json({ success: true, data: comments });
});

export const getCommentById = asyncHandler(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.id);
  res.json({ success: true, data: comment });
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.id,
    req.body
  );
  res.json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.id);
  res.json({ success: true, message: "Comment deleted successfully" });
});