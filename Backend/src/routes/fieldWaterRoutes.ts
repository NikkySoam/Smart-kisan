import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFieldWater,
  getFieldWater,
  getFieldWaterByField,
  updateFieldWater,
  deleteFieldWater
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

router.put(
  "/:id",
  protect,
  updateFieldWater
);

router.delete(
  "/:id",
  protect,
  deleteFieldWater
);

export default router;