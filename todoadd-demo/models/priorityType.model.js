import mongoose from "mongoose";

const priorityTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    level: { type: Number, default: 0 },
  },
  { timestamps: false }
);

export default mongoose.model("PriorityType", priorityTypeSchema);
