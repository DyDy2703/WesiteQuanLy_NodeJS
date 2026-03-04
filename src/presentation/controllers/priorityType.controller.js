import priorityTypeService from "../../business/services/prioritytype.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class PriorityTypeController {
  createPriorityType = asyncHandler(async (req, res) => {
    const type = await priorityTypeService.createPriorityType(req.body);
    res.status(201).json({ success: true, data: type });
  });

  getAllPriorityTypes = asyncHandler(async (req, res) => {
    const types = await priorityTypeService.getAllPriorityTypes();
    res.json({ success: true, data: types });
  });

  getPriorityTypeById = asyncHandler(async (req, res) => {
    const type = await priorityTypeService.getPriorityTypeById(req.params.id);
    res.json({ success: true, data: type });
  });

  updatePriorityType = asyncHandler(async (req, res) => {
    const type = await priorityTypeService.updatePriorityType(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: type });
  });

  deletePriorityType = asyncHandler(async (req, res) => {
    await priorityTypeService.deletePriorityType(req.params.id);
    res.json({
      success: true,
      message: "Priority type deleted successfully",
    });
  });
}

export default new PriorityTypeController();