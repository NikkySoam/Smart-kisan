import express from "express";

import protect from "../middleware/authMiddleware";

import {
  addField,
  getFields,
  getFieldDetails,
  updateField,
  deleteField
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

router.put(
  "/:id",
  protect,
  updateField
);

router.delete(
  "/:id",
  protect,
  deleteField
);

export default router;