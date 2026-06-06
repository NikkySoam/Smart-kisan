"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const equipmentController_1 = require("../controllers/equipmentController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, equipmentController_1.addEquipment);
router.get("/field/:fieldId", authMiddleware_1.default, equipmentController_1.getEquipmentByField);
router.put("/:id", authMiddleware_1.default, equipmentController_1.updateEquipment);
router.delete("/:id", authMiddleware_1.default, equipmentController_1.deleteEquipment);
exports.default = router;
