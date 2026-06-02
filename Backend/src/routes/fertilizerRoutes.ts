import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFertilizer,
  getFertilizers,
  getFertilizersByField
} from "../controllers/fertilizerController";

const router = express.Router();

router.post(
  "/",
  protect,
  addFertilizer
);

router.get(
  "/",
  protect,
  getFertilizers
);

router.get(
  "/field/:fieldId",
  protect,
  getFertilizersByField
);

export default router;