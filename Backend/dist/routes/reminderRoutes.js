"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const reminderController_1 = require("../controllers/reminderController");
const router = express_1.default.Router();
router.get("/check", authMiddleware_1.default, reminderController_1.checkReminders);
exports.default = router;
