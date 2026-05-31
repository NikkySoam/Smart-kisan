import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addFarmer,
  getFarmers,
  updateFarmer,
  deleteFarmer
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

router.put(
  "/:id",
  protect,
  updateFarmer
);

router.delete(
  "/:id",
  protect,
  deleteFarmer
);

export default router;