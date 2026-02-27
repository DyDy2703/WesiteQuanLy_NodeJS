import Project from "../models/project.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProject = asyncHandler(async (req, res) => {
  const { name, key, description, lead_id } = req.body;
  if (!name || !key) {
    res.status(400);
    throw new Error("name and key are required");
  }

  const existing = await Project.findOne({ key });
  if (existing) {
    res.status(409);
    throw new Error("Project key already exists");
  }

  const project = await Project.create({ name, key, description, lead_id });
  res.status(201).json({ success: true, data: project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  res.json({ success: true, data: projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project ID");
  }
  const project = await Project.findById(id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project ID");
  }
  const project = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project ID");
  }
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});
