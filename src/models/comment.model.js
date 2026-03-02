import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issue_id: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Comment", commentSchema);
