import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFertilizer,
  getFertilizers,
  getFertilizersByField,
  updateFertilizer,
  deleteFertilizer
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

router.put(
  "/:id",
  protect,
  updateFertilizer
);

router.delete(
  "/:id",
  protect,
  deleteFertilizer
);

export default router;
