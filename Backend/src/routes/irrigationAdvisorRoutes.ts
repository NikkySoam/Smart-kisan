import express from "express";
import { getIrrigationAdvice } from "../controllers/irrigationAdvisorController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:fieldId", protect, getIrrigationAdvice);

// We can just use the same controller function and rely on the ?refresh=true query param,
// or map a specific POST route to it
router.post("/refresh/:fieldId", protect, (req, res) => {
  req.query.refresh = "true";
  return getIrrigationAdvice(req, res);
});

export default router;
