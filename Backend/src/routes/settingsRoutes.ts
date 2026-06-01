import express from "express";

import protect from "../middleware/authMiddleware";

import {
  updateWaterRate,
  getSettings,
  updateProfile
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

router.put(
  "/update-profile",
  protect,
  updateProfile
);

export default router;