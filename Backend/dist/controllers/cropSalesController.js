"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceipt = exports.updateReceipt = exports.createReceipt = exports.getReceipts = void 0;
const CropSaleReceipt_1 = __importDefault(require("../models/CropSaleReceipt"));
const Field_1 = __importDefault(require("../models/Field"));
const getReceipts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fieldId = req.params.fieldId;
        const userId = req.user._id;
        const receipts = yield CropSaleReceipt_1.default.find({ field: fieldId, user: userId }).sort({ date: -1 });
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
    }
    catch (error) {
        console.error("Get Receipts Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch receipts" });
    }
});
exports.getReceipts = getReceipts;
const createReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fieldId = req.params.fieldId;
        const userId = req.user._id;
        const { buyerName, date, quantity, notes } = req.body;
        const field = yield Field_1.default.findOne({ _id: fieldId, user: userId });
        if (!field) {
            return res.status(404).json({ success: false, message: "Field not found" });
        }
        const pricePerQuintal = field.cropSellingPrice || 0;
        if (pricePerQuintal <= 0) {
            return res.status(400).json({ success: false, message: "Please set crop selling price first." });
        }
        const totalAmount = Number(quantity) * pricePerQuintal;
        const receipt = yield CropSaleReceipt_1.default.create({
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
    }
    catch (error) {
        console.error("Create Receipt Error:", error);
        return res.status(500).json({ success: false, message: "Failed to create receipt" });
    }
});
exports.createReceipt = createReceipt;
const updateReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptId = req.params.receiptId;
        const userId = req.user._id;
        const { buyerName, date, quantity, notes } = req.body;
        const receipt = yield CropSaleReceipt_1.default.findOne({ _id: receiptId, user: userId });
        if (!receipt) {
            return res.status(404).json({ success: false, message: "Receipt not found" });
        }
        receipt.buyerName = buyerName;
        receipt.date = date;
        receipt.quantity = Number(quantity);
        receipt.totalAmount = Number(quantity) * receipt.pricePerQuintal;
        if (notes !== undefined)
            receipt.notes = notes;
        yield receipt.save();
        return res.status(200).json({ success: true, data: receipt });
    }
    catch (error) {
        console.error("Update Receipt Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update receipt" });
    }
});
exports.updateReceipt = updateReceipt;
const deleteReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptId = req.params.receiptId;
        const userId = req.user._id;
        yield CropSaleReceipt_1.default.findOneAndDelete({ _id: receiptId, user: userId });
        return res.status(200).json({ success: true, message: "Receipt deleted" });
    }
    catch (error) {
        console.error("Delete Receipt Error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete receipt" });
    }
});
exports.deleteReceipt = deleteReceipt;
