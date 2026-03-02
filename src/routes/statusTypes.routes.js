import express from "express";
import {
  createStatusType,
  getAllStatusTypes,
  getStatusTypeById,
  updateStatusType,
  deleteStatusType,
} from "../controllers/statusType.controller.js";

const router = express.Router();

router.post("/", createStatusType);
router.get("/", getAllStatusTypes);
router.get("/:id", getStatusTypeById);
router.put("/:id", updateStatusType);
router.delete("/:id", deleteStatusType);

export default router;
