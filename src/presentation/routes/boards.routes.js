import express from "express";
import boardController from "../controllers/board.controller.js";

const boardsRoutes = express.Router();

boardsRoutes.post("/", boardController.createBoard);
boardsRoutes.get("/", boardController.getAllBoards);
boardsRoutes.get("/:id", boardController.getBoardById);
boardsRoutes.put("/:id", boardController.updateBoard);
boardsRoutes.delete("/:id", boardController.deleteBoard);

export default boardsRoutes;