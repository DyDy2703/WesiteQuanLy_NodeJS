import issueTypeService from "../../business/services/issuetype.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class IssueTypeController {
  createIssueType = asyncHandler(async (req, res) => {
    const type = await issueTypeService.createIssueType(req.body);
    res.status(201).json({ success: true, data: type });
  });

  getAllIssueTypes = asyncHandler(async (req, res) => {
    const types = await issueTypeService.getAllIssueTypes();
    res.json({ success: true, data: types });
  });

  getIssueTypeById = asyncHandler(async (req, res) => {
    const type = await issueTypeService.getIssueTypeById(req.params.id);
    res.json({ success: true, data: type });
  });

  updateIssueType = asyncHandler(async (req, res) => {
    const type = await issueTypeService.updateIssueType(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: type });
  });

  deleteIssueType = asyncHandler(async (req, res) => {
    await issueTypeService.deleteIssueType(req.params.id);
    res.json({ success: true, message: "Issue type deleted successfully" });
  });
}

export default new IssueTypeController();