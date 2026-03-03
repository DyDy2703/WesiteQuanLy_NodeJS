import projectService from "../../business/services/project.service.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

class ProjectController {
  createProject = asyncHandler(async (req, res) => {
    const result = await projectService.createProject(req.body);
    res.status(201).json({ success: true, data: result });
  });

  getAllProjects = asyncHandler(async (req, res) => {
    const result = await projectService.getAllProjects();
    res.json({ success: true, data: result });
  });

  getProjectById = asyncHandler(async (req, res) => {
    const result = await projectService.getProjectById(req.params.id);
    res.json({ success: true, data: result });
  });

  updateProject = asyncHandler(async (req, res) => {
    const result = await projectService.updateProject(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: result });
  });

  deleteProject = asyncHandler(async (req, res) => {
    const result = await projectService.deleteProject(req.params.id);
    res.json({ success: true, data: result });
  });
}

export default new ProjectController();