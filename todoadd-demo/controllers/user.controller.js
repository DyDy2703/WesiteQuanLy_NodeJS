import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, display_name, role, active } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("username, email and password are required");
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    res.status(409);
    throw new Error("username or email already in use");
  }

  const user = await User.create({ username, email, password, display_name, role, active });
  res.status(201).json({ success: true, data: user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, password, display_name, role, active } = req.body;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }
  const updateFields = {};
  if (username !== undefined) updateFields.username = username;
  if (email !== undefined) updateFields.email = email;
  if (password !== undefined) updateFields.password = password;
  if (display_name !== undefined) updateFields.display_name = display_name;
  if (role !== undefined) updateFields.role = role;
  if (active !== undefined) updateFields.active = active;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  const user = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});
