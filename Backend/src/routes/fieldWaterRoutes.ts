import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFieldWater,
  getFieldWater,
  getFieldWaterByField
} from "../controllers/fieldWaterController";

const router = express.Router();

router.post(
  "/",
  protect,
  addFieldWater
);

router.get(
  "/",
  protect,
  getFieldWater
);

router.get(
  "/field/:fieldId",
  protect,
  getFieldWaterByField
);

export default router;