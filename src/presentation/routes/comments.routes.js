import express from "express";
import commentController from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", commentController.createComment);
router.get("/", commentController.getAllComments);
router.get("/:id", commentController.getCommentById);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;
