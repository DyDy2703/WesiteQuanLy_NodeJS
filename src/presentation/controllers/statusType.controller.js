import statusTypeService from "../../business/services/statusType.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

export const createStatusType = asyncHandler(async (req, res) => {
  const type = await statusTypeService.createStatusType(req.body);
  res.status(201).json({ success: true, data: type });
});

export const getAllStatusTypes = asyncHandler(async (req, res) => {
  const types = await statusTypeService.getAllStatusTypes();
  res.json({ success: true, data: types });
});

export const getStatusTypeById = asyncHandler(async (req, res) => {
  const type = await statusTypeService.getStatusTypeById(req.params.id);
  res.json({ success: true, data: type });
});

export const updateStatusType = asyncHandler(async (req, res) => {
  const type = await statusTypeService.updateStatusType(
    req.params.id,
    req.body
  );
  res.json({ success: true, data: type });
});

export const deleteStatusType = asyncHandler(async (req, res) => {
  await statusTypeService.deleteStatusType(req.params.id);
  res.json({
    success: true,
    message: "Status type deleted successfully",
  });
});