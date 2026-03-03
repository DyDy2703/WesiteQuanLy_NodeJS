import sprintService from "../../business/services/sprint.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class SprintController {
  createSprint = asyncHandler(async (req, res) => {
    const result = await sprintService.createSprint(req.body);
    res.status(201).json({ success: true, data: result });
  });

  getAllSprints = asyncHandler(async (req, res) => {
    const result = await sprintService.getAllSprints();
    res.json({ success: true, data: result });
  });

  getSprintById = asyncHandler(async (req, res) => {
    const result = await sprintService.getSprintById(req.params.id);
    res.json({ success: true, data: result });
  });

  updateSprint = asyncHandler(async (req, res) => {
    const result = await sprintService.updateSprint(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: result });
  });

  deleteSprint = asyncHandler(async (req, res) => {
    const result = await sprintService.deleteSprint(req.params.id);
    res.json({ success: true, data: result });
  });
}

export default new SprintController();