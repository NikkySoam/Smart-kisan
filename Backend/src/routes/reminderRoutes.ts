import express from "express";

import protect from "../middleware/authMiddleware";

import {
  checkReminders,
} from "../controllers/reminderController";

const router = express.Router();

router.get(
  "/check",
  protect,
  checkReminders
);

export default router;