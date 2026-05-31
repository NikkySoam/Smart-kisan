import express from "express";

import {
  addWaterEntry,
  getWaterEntries,
  getFarmerWaterHistory,
  deleteWaterEntry,
} from "../controllers/waterController";

import protect from "../middleware/authMiddleware";

const router = express.Router();


// ADD WATER ENTRY

router.post(
  "/",
  protect,
  addWaterEntry
);


// GET ALL WATER ENTRIES

router.get(
  "/",
  protect,
  getWaterEntries
);


// GET SINGLE FARMER WATER HISTORY

router.get(
  "/farmer/:farmerId",
  protect,
  getFarmerWaterHistory
);


// DELETE WATER ENTRY

router.delete(
  "/:id",
  protect,
  deleteWaterEntry
);


export default router;