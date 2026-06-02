import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addCrop,
  getCrops,
} from "../controllers/cropController";

const router = express.Router();

router.post(
  "/",
  protect,
  addCrop
);

router.get(
  "/",
  protect,
  getCrops
);

export default router;