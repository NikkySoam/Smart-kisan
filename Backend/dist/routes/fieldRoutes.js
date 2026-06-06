"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const fieldController_1 = require("../controllers/fieldController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, fieldController_1.addField);
router.get("/", authMiddleware_1.default, fieldController_1.getFields);
router.get("/:id", authMiddleware_1.default, fieldController_1.getFieldDetails);
router.put("/:id", authMiddleware_1.default, fieldController_1.updateField);
router.delete("/:id", authMiddleware_1.default, fieldController_1.deleteField);
exports.default = router;
