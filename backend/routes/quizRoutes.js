import express from "express";
import { createQuiz, getQuizzes, getQuizById } from "../controllers/quizController.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", getQuizzes);
router.get("/:id", auth, getQuizById);
router.post("/", auth, createQuiz);
export default router;
