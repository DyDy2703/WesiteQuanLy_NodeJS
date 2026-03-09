import express from "express";
import commentController from "../controllers/comment.controller.js";

const commentsRoutes = express.Router();

commentsRoutes.post("/", commentController.createComment);
commentsRoutes.get("/", commentController.getAllComments);
commentsRoutes.get("/:id", commentController.getCommentById);
commentsRoutes.put("/:id", commentController.updateComment);
commentsRoutes.delete("/:id", commentController.deleteComment);

export default commentsRoutes;
