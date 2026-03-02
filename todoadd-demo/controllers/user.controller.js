import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   POST /api/users/
 * @desc    Create a new user   
 * @body    { username, email, password, display_name, role, active }
 * @returns 200 OK | 400 Not required | 404 Not Found | 409 Exist | 500 Internal Server Error
**/

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


/**
 * @route   GET /api/users/
 * @desc    Get all user
 * @body    { }
 * @returns 200 OK | 404 Not Found | 500 Internal Server Error
**/

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});


/**
 * @route   GET /api/users/{userID}
 * @desc    Get user by ID   
 * @body    { username, email, password, display_name, role, active }
 * @returns 200 OK | 400 ID Not Found | 404 User Not Found | 500 Internal Server Error
**/

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


/**
 * @route   Post /api/users/{userID}
 * @desc    Update user by ID   
 * @body    { username?, email?, password?, display_name?, role? }
 * @returns 200 OK | 400 ID Not Found | 404 User Not Found | 500 Internal Server Error
**/

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

/**
 * @route  
 * @desc    
 * @body    { }
 * @returns 200 OK | 400 ID Not Found | 404 User Not Found | 500 Internal Server Error
**/

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
