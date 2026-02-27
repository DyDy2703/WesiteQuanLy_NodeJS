import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    board_id: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    start_date: { type: Date },
    end_date: { type: Date },
    status: { type: String, default: "planned" },
  },
  { timestamps: false }
);

export default mongoose.model("Sprint", sprintSchema);
