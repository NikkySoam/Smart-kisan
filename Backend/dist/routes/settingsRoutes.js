"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const settingsController_1 = require("../controllers/settingsController");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.default, settingsController_1.getSettings);
router.put("/water-rate", authMiddleware_1.default, settingsController_1.updateWaterRate);
router.put("/update-profile", authMiddleware_1.default, settingsController_1.updateProfile);
router.put("/city", authMiddleware_1.default, settingsController_1.updateCity);
exports.default = router;
