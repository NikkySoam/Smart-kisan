"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const irrigationAdvisorController_1 = require("../controllers/irrigationAdvisorController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get("/:fieldId", authMiddleware_1.default, irrigationAdvisorController_1.getIrrigationAdvice);
// We can just use the same controller function and rely on the ?refresh=true query param,
// or map a specific POST route to it
router.post("/refresh/:fieldId", authMiddleware_1.default, (req, res) => {
    req.query.refresh = "true";
    return (0, irrigationAdvisorController_1.getIrrigationAdvice)(req, res);
});
exports.default = router;
