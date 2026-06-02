import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addField,
  getFields,
  getFieldDetails
} from "../controllers/fieldController";

const router = express.Router();

router.post(
  "/",
  protect,
  addField
);

router.get(
  "/",
  protect,
  getFields
);

router.get(
  "/:id",
  protect,
  getFieldDetails
);

export default router;