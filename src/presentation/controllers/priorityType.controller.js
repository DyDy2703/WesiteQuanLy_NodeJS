import priorityTypeService from "../../business/services/prioritytype.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

export const createPriorityType = asyncHandler(async (req, res) => {
  const type = await priorityTypeService.createPriorityType(req.body);
  res.status(201).json({ success: true, data: type });
});

export const getAllPriorityTypes = asyncHandler(async (req, res) => {
  const types = await priorityTypeService.getAllPriorityTypes();
  res.json({ success: true, data: types });
});

export const getPriorityTypeById = asyncHandler(async (req, res) => {
  const type = await priorityTypeService.getPriorityTypeById(req.params.id);
  res.json({ success: true, data: type });
});

export const updatePriorityType = asyncHandler(async (req, res) => {
  const type = await priorityTypeService.updatePriorityType(
    req.params.id,
    req.body
  );
  res.json({ success: true, data: type });
});

export const deletePriorityType = asyncHandler(async (req, res) => {
  await priorityTypeService.deletePriorityType(req.params.id);
  res.json({
    success: true,
    message: "Priority type deleted successfully",
  });
});