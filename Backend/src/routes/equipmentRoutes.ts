import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addEquipment,
  getEquipmentByField,
  updateEquipment,
  deleteEquipment,
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

router.put(
  "/:id",
  protect,
  updateEquipment
);

router.delete(
  "/:id",
  protect,
  deleteEquipment
);

export default router;
