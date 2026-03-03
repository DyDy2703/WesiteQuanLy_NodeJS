import boardService from "../../business/services/board.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class BoardController {
  createBoard = asyncHandler(async (req, res) => {
    const result = await boardService.createBoard(req.body);
    res.status(201).json({ success: true, data: result });
  });

  getAllBoards = asyncHandler(async (req, res) => {
    const result = await boardService.getAllBoards();
    res.json({ success: true, data: result });
  });

  getBoardById = asyncHandler(async (req, res) => {
    const result = await boardService.getBoardById(req.params.id);
    res.json({ success: true, data: result });
  });

  updateBoard = asyncHandler(async (req, res) => {
    const result = await boardService.updateBoard(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: result });
  });

  deleteBoard = asyncHandler(async (req, res) => {
    const result = await boardService.deleteBoard(req.params.id);
    res.json({ success: true, data: result });
  });
}

export default new BoardController();