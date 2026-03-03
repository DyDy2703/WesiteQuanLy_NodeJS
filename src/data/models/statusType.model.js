import mongoose from "mongoose";

const statusTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: false }
);

export default mongoose.model("StatusType", statusTypeSchema);
