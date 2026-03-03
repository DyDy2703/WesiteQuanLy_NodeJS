import issueService from "../../business/services/issue.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class IssueController {
  createIssue = asyncHandler(async (req, res) => {
    const result = await issueService.createIssue(req.body);
    res.status(201).json({ success: true, data: result });
  });

  getAllIssues = asyncHandler(async (req, res) => {
    const result = await issueService.getAllIssues();
    res.json({ success: true, data: result });
  });

  getIssueById = asyncHandler(async (req, res) => {
    const result = await issueService.getIssueById(req.params.id);
    res.json({ success: true, data: result });
  });

  updateIssue = asyncHandler(async (req, res) => {
    const result = await issueService.updateIssue(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: result });
  });

  deleteIssue = asyncHandler(async (req, res) => {
    const result = await issueService.deleteIssue(req.params.id);
    res.json({ success: true, data: result });
  });
}

export default new IssueController();