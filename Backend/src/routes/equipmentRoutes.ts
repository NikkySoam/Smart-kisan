import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addEquipment,
  getEquipmentByField,
} from "../controllers/equipmentController";

const router = express.Router();

router.post(
  "/",
  protect,
  addEquipment
);

router.get(
  "/field/:fieldId",
  protect,
  getEquipmentByField
);

export default router;