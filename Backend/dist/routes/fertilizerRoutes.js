"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const fertilizerController_1 = require("../controllers/fertilizerController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, fertilizerController_1.addFertilizer);
router.get("/", authMiddleware_1.default, fertilizerController_1.getFertilizers);
router.get("/field/:fieldId", authMiddleware_1.default, fertilizerController_1.getFertilizersByField);
router.put("/:id", authMiddleware_1.default, fertilizerController_1.updateFertilizer);
router.delete("/:id", authMiddleware_1.default, fertilizerController_1.deleteFertilizer);
exports.default = router;
