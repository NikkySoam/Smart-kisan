import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { chat } from "../controllers/chatbotController";

const router = Router();

// Read-only, authenticated chatbot. req.user is established by protect.
router.post("/", protect, chat);

export default router;
