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
  if (lead_id !== undefined && lead_id !== null && lead_id !== "" && !validateObjectId(lead_id)) {
    res.status(400);
    throw new Error("lead_id must be a valid ObjectId");
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
  const { name, key, description, lead_id } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project ID");
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (key !== undefined) updateFields.key = key;
  if (description !== undefined) updateFields.description = description;
  if (lead_id !== undefined) updateFields.lead_id = lead_id;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }
  if (
    updateFields.lead_id !== undefined &&
    updateFields.lead_id !== null &&
    updateFields.lead_id !== "" &&
    !validateObjectId(updateFields.lead_id)
  ) {
    res.status(400);
    throw new Error("lead_id must be a valid ObjectId");
  }

  const project = await Project.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
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
