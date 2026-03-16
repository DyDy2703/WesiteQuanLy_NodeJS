import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issue_key: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: "StatusType" },
    priority_id: { type: mongoose.Schema.Types.ObjectId, ref: "PriorityType" },
    type_id: { type: mongoose.Schema.Types.ObjectId, ref: "IssueType" },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    reporter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    start_at: { type: Date },
    due_at: { type: Date },
    estimated_hours: { type: Number, default: 0 },
    spent_hours: { type: Number, default: 0 },
    completed_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Indexes to speed up time-based queries
issueSchema.index({ due_at: 1 });
issueSchema.index({ start_at: 1 });

export default mongoose.model("Issue", issueSchema);
