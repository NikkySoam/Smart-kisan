import express from "express";
import multer from "multer";

import { detectCropIssue } from "../services/aiController";

import protect from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/detect-pest", protect, upload.single("image"), detectCropIssue);

export default router;