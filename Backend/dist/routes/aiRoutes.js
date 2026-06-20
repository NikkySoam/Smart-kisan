"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const aiController_1 = require("../services/aiController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
router.post("/detect-pest", authMiddleware_1.default, upload.single("image"), aiController_1.detectCropIssue);
router.get("/history", authMiddleware_1.default, aiController_1.getCropHistory);
router.delete("/history/:id", authMiddleware_1.default, aiController_1.deleteCropScan);
exports.default = router;
