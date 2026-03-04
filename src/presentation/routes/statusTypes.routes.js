import express from "express";
import statusTypeController from "../controllers/statusType.controller.js";

const router = express.Router();

router.post("/", statusTypeController.createStatusType);
router.get("/", statusTypeController.getAllStatusTypes);
router.get("/:id", statusTypeController.getStatusTypeById);
router.put("/:id", statusTypeController.updateStatusType);
router.delete("/:id", statusTypeController.deleteStatusType);

export default router;
