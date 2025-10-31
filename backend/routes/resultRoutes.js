import express from "express";
import { submitQuiz, getResultsForUser, getTopResults } from "../controllers/resultController.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/submit", auth, submitQuiz);
router.get("/my", auth, getResultsForUser);
router.get("/top", getTopResults);
export default router;
