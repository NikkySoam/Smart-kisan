"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const labourController_1 = require("../controllers/labourController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, labourController_1.addLabour);
router.get("/field/:fieldId", authMiddleware_1.default, labourController_1.getLabourByField);
router.put("/:id", authMiddleware_1.default, labourController_1.updateLabour);
router.delete("/:id", authMiddleware_1.default, labourController_1.deleteLabour);
exports.default = router;
