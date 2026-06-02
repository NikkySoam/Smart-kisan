import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addLabour,
  getLabourByField,
  updateLabour,
  deleteLabour,
} from "../controllers/labourController";

const router = express.Router();

router.post(
  "/",
  protect,
  addLabour
);

router.get(
  "/field/:fieldId",
  protect,
  getLabourByField
);

router.put(
  "/:id",
  protect,
  updateLabour
);

router.delete(
  "/:id",
  protect,
  deleteLabour
);

export default router;
