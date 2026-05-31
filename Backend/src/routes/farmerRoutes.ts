import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFarmer,
  getFarmers,
} from "../controllers/farmerController";

const router = express.Router();

router.post(
  "/",
  protect,
  addFarmer
);

router.get(
  "/",
  protect,
  getFarmers
);

export default router;