"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const farmerController_1 = require("../controllers/farmerController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, farmerController_1.addFarmer);
router.get("/", authMiddleware_1.default, farmerController_1.getFarmers);
router.put("/:id", authMiddleware_1.default, farmerController_1.updateFarmer);
router.delete("/:id", authMiddleware_1.default, farmerController_1.deleteFarmer);
exports.default = router;
