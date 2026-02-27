import mongoose from "mongoose";

const issueTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: false }
);

export default mongoose.model("IssueType", issueTypeSchema);
