import Project from "../models/project.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/projects/
 * @desc    Create a new project   
 * @body    { name, key, description?, lead_id }
 * @returns 201 OK | 400 Not Required | 404 Not Found | 409 Already Exists |500 Internal Server Error
**/

export const createProject = asyncHandler(async (req, res) => {
  const { name, key, description, lead_id } = req.body;
  if (!name || !key || !lead_id) {
    res.status(400);
    throw new Error("name and key and lead_id are required");
  }

  const existing = await Project.findOne({ key });
  if (existing) {
    res.status(409);
    throw new Error("Project key already exists");
  }

  const project = await Project.create({ name, key, description, lead_id });
  res.status(201).json({ success: true, data: project });
});


/**
 * @route   GET /api/projects/
 * @desc    Get all projects
 * @body    { }
 * @returns 200 OK | 404 Not Found | 500 Internal Server Error
**/

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  res.json({ success: true, data: projects });
});


/**
 * @route   GET /api/projects/{projectID}
 * @desc    Get all project by ID
 * @body    { }
 * @returns 200 OK | 400 ID Not Found | 404 Not Found | 500 Internal Server Error
**/

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


/**
 * @route   POST /api/projects/{projectID}
 * @desc    Update project by ID   
 * @body    { name, key, description?, lead_id }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
**/

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!body) {
    res.status(405);
    throw new Error("Bad Request");
  }
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


/**
 * @route   DELETE /api/projects/{projectID}
 * @desc    Delete project by ID
 * @body    { }
 * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
**/

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
