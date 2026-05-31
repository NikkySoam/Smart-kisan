import express from "express";

import protect from "../middleware/authMiddleware";

import {
  updateWaterRate,
  getSettings,
} from "../controllers/settingsController";

const router = express.Router();

router.get(
  "/",
  protect,
  getSettings
);

router.put(
  "/water-rate",
  protect,
  updateWaterRate
);

export default router;