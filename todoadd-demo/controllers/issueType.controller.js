import IssueType from "../models/issueType.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createIssueType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }
  const exist = await IssueType.findOne({ name });
  if (exist) {
    res.status(409);
    throw new Error("Issue type already exists");
  }
  const type = await IssueType.create({ name });
  res.status(201).json({ success: true, data: type });
});

export const getAllIssueTypes = asyncHandler(async (req, res) => {
  const types = await IssueType.find();
  res.json({ success: true, data: types });
});

export const getIssueTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await IssueType.findById(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});

export const updateIssueType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  if (name === undefined || String(name).trim() === "") {
    res.status(400);
    throw new Error("name is required");
  }
  const type = await IssueType.findByIdAndUpdate(id, { name }, {
    new: true,
    runValidators: true,
  });
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});

export const deleteIssueType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
  const type = await IssueType.findByIdAndDelete(id);
  if (!type) {
    res.status(404);
    throw new Error("Not found");
  }
  res.json({ success: true, data: type });
});
