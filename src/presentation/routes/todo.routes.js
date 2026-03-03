import express from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
} from "../controllers/todo.controller.js";

const route = express.Router();

// Create todo - POST /api/todos/add
route.post("/add", createTodo);

// Get all todos - GET /api/todos
route.get("/", getAllTodos);

// Get single todo - GET /api/todos/:id
route.get("/:id", getTodoById);

// Update todo - PUT /api/todos/:id
route.put("/:id", updateTodo);

// Toggle completion status - PATCH /api/todos/:id/status
route.patch("/:id/status", toggleTodoStatus);

// Delete todo - DELETE /api/todos/:id
route.delete("/:id", deleteTodo);

export default route;