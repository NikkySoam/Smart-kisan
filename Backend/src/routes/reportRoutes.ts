import express from "express";

import protect from "../middleware/authMiddleware";

import {
  getMonthlyReport,
} from "../controllers/reportController";

const router = express.Router();

router.get(
  "/monthly",
  protect,
  getMonthlyReport
);

export default router;