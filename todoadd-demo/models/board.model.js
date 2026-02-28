import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: false }
);

export default mongoose.model("Board", boardSchema);
