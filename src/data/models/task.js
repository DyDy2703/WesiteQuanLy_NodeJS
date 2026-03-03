const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do"},
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);