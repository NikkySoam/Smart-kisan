import express from "express";
import { getReceipts, createReceipt, updateReceipt, deleteReceipt } from "../controllers/cropSalesController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:fieldId", protect, getReceipts);
router.post("/:fieldId", protect, createReceipt);
router.put("/:receiptId", protect, updateReceipt);
router.delete("/:receiptId", protect, deleteReceipt);

export default router;
