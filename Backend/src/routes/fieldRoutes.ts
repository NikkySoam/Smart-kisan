import express from "express";
import multer from "multer";

import protect from "../middleware/authMiddleware";

import {
  addField,
  getFields,
  getFieldDetails,
  updateField,
  deleteField
} from "../controllers/fieldController";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  protect,
  upload.single("image"),
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
  upload.single("image"),
  updateField
);

router.delete(
  "/:id",
  protect,
  deleteField
);

export default router;