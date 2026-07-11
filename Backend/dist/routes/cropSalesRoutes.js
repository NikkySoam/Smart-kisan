"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cropSalesController_1 = require("../controllers/cropSalesController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get("/:fieldId", authMiddleware_1.default, cropSalesController_1.getReceipts);
router.post("/:fieldId", authMiddleware_1.default, cropSalesController_1.createReceipt);
router.put("/:receiptId", authMiddleware_1.default, cropSalesController_1.updateReceipt);
router.delete("/:receiptId", authMiddleware_1.default, cropSalesController_1.deleteReceipt);
exports.default = router;
