"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const fieldWaterController_1 = require("../controllers/fieldWaterController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, fieldWaterController_1.addFieldWater);
router.get("/", authMiddleware_1.default, fieldWaterController_1.getFieldWater);
router.get("/field/:fieldId", authMiddleware_1.default, fieldWaterController_1.getFieldWaterByField);
router.put("/:id", authMiddleware_1.default, fieldWaterController_1.updateFieldWater);
router.delete("/:id", authMiddleware_1.default, fieldWaterController_1.deleteFieldWater);
exports.default = router;
