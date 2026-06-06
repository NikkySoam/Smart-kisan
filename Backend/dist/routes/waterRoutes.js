"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const waterController_1 = require("../controllers/waterController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// ADD WATER ENTRY
router.post("/", authMiddleware_1.default, waterController_1.addWaterEntry);
// GET ALL WATER ENTRIES
router.get("/", authMiddleware_1.default, waterController_1.getWaterEntries);
// GET SINGLE FARMER WATER HISTORY
router.get("/farmer/:farmerId", authMiddleware_1.default, waterController_1.getFarmerWaterHistory);
// DELETE WATER ENTRY
router.delete("/:id", authMiddleware_1.default, waterController_1.deleteWaterEntry);
router.put("/:id", authMiddleware_1.default, waterController_1.updateWaterEntry);
exports.default = router;
