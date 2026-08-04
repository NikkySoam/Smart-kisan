import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import CropSaleReceipt from "../models/CropSaleReceipt";
import Field from "../models/Field";

export const getReceipts = async (req: AuthRequest, res: Response) => {
  try {
    const fieldId = req.params.fieldId as string;
    const userId = req.user._id;

    const receipts = await CropSaleReceipt.find({ field: fieldId, user: userId }).sort({ date: -1 });

    const totalSelling = receipts.reduce((acc, item) => acc + item.totalAmount, 0);
    const totalQuantity = receipts.reduce((acc, item) => acc + item.quantity, 0);

    return res.status(200).json({
      success: true,
      data: {
        receipts,
        totalSelling,
        totalQuantity,
      },
    });
  } catch (error) {
    console.error("Get Receipts Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch receipts" });
  }
};

export const createReceipt = async (req: AuthRequest, res: Response) => {
  try {
    const fieldId = req.params.fieldId as string;
    const userId = req.user._id;
    const { buyerName, date, quantity, notes } = req.body;

    const field = await Field.findOne({ _id: fieldId, user: userId });
    if (!field) {
      return res.status(404).json({ success: false, message: "Field not found" });
    }

    const pricePerQuintal = field.cropSellingPrice || 0;
    if (pricePerQuintal <= 0) {
      return res.status(400).json({ success: false, message: "Please set crop selling price first." });
    }

    const totalAmount = Number(quantity) * pricePerQuintal;

    const receipt = await CropSaleReceipt.create({
      user: userId,
      field: fieldId,
      buyerName,
      date,
      quantity: Number(quantity),
      pricePerQuintal,
      totalAmount,
      notes,
    });

    return res.status(201).json({ success: true, data: receipt });
  } catch (error) {
    console.error("Create Receipt Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create receipt" });
  }
};

export const updateReceipt = async (req: AuthRequest, res: Response) => {
  try {
    const receiptId = req.params.receiptId as string;
    const userId = req.user._id;
    const { buyerName, date, quantity, notes } = req.body;

    const receipt = await CropSaleReceipt.findOne({ _id: receiptId, user: userId });
    if (!receipt) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    receipt.buyerName = buyerName;
    receipt.date = date;
    receipt.quantity = Number(quantity);
    receipt.totalAmount = Number(quantity) * receipt.pricePerQuintal;
    if (notes !== undefined) receipt.notes = notes;

    await receipt.save();

    return res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    console.error("Update Receipt Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update receipt" });
  }
};

export const deleteReceipt = async (req: AuthRequest, res: Response) => {
  try {
    const receiptId = req.params.receiptId as string;
    const userId = req.user._id;

    await CropSaleReceipt.findOneAndDelete({ _id: receiptId, user: userId });

    return res.status(200).json({ success: true, message: "Receipt deleted" });
  } catch (error) {
    console.error("Delete Receipt Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete receipt" });
  }
};
