import express from "express";
import multer from "multer";

import { detectCropIssue, getCropHistory, deleteCropScan} from "../services/aiController";

import protect from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/detect-pest", protect, upload.single("image"), detectCropIssue);
router.get("/history", protect, getCropHistory );
router.delete("/history/:id", protect, deleteCropScan );

export default router;