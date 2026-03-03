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
    due_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Issue", issueSchema);
