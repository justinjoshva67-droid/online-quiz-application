import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success:false, message: "Admin only" });
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();
    const avgScoreAgg = await Result.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }]);
    const avgScore = avgScoreAgg[0]?.avgScore || 0;
    res.json({ success:true, data: { totalUsers, totalQuizzes, totalAttempts, avgScore } });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getTrends = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success:false, message: "Admin only" });
    const trends = await Result.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, attempts: { $sum: 1 }, avg: { $avg: "$score" } } },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    res.json({ success:true, data: trends });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};
