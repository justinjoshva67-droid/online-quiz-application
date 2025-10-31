import express from "express";
import { getStats, getTrends } from "../controllers/adminController.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/stats", auth, getStats);
router.get("/trends", auth, getTrends);
export default router;
