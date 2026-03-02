import mongoose from "mongoose";
import Todo from "../models/todo.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// helper for ID validation
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create todo
export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate
  if (!title || title.trim() === "") {
    res.status(400);
    throw new Error("Title is required");
  }

  const todo = await Todo.create({
    title,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

// Get all todos
export const getAllTodos = asyncHandler(async (req, res) => {
  const { search, sort, page = 1, limit = 10 } = req.query;

  let query = {};

  // Search by title
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // Sorting
  const sortOption = {
    createdAt: sort === "asc" ? 1 : -1,
  };

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    res.status(400);
    throw new Error("page must be a positive integer");
  }
  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    res.status(400);
    throw new Error("limit must be an integer between 1 and 100");
  }
  const skip = (pageNumber - 1) * limitNumber;

  const todos = await Todo.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  const totalTodos = await Todo.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Todos fetched successfully",
    total: totalTodos,
    page: pageNumber,
    limit: limitNumber,
    data: todos,
  });
});

// Get todo by ID
export const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo fetched successfully",
    data: todo,
  });
});

// Update an existing todo (replace fields)
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  // At least one field must be present
  if ((title && title.trim() === "") || (title === "")) {
    res.status(400);
    throw new Error("Title cannot be blank");
  }

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("Nothing to update");
  }

  const updated = await Todo.findByIdAndUpdate(id, updateFields, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updated) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updated,
  });
});

// Toggle completion status (PATCH)
export const toggleTodoStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  if (typeof isCompleted !== "boolean") {
    res.status(400);
    throw new Error("isCompleted must be a boolean");
  }

  const todo = await Todo.findByIdAndUpdate(
    id,
    { isCompleted },
    { returnDocument: "after" }
  );

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo status updated",
    data: todo,
  });
});

// Delete todo
export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid Todo ID");
  }

  const removed = await Todo.findByIdAndDelete(id);

  if (!removed) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: removed,
  });
});