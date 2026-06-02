import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addLabour,
  getLabourByField,
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

export default router;