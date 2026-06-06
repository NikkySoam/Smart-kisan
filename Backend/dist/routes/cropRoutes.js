"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const cropController_1 = require("../controllers/cropController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, cropController_1.addCrop);
router.get("/", authMiddleware_1.default, cropController_1.getCrops);
exports.default = router;
