import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";
import sendNotification from "./notify.js";

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success:false, message: "Quiz not found" });
    let score = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) score += (q.marks || 1); });
    const result = await Result.create({ user: userId, quiz: quizId, score, total: quiz.questions.length, answers });
    // send email async
    const user = req.user;
    sendNotification('submission', { to: user.email, name: user.name, quizTitle: quiz.title, score, total: quiz.questions.length }).catch(console.error);
    res.json({ success:true, data: result });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getResultsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ user: userId }).populate("quiz", "title");
    res.json({ success:true, data: results });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getTopResults = async (req, res) => {
  try {
    const top = await Result.find().sort({ score: -1 }).limit(10).populate("user", "name avatar").populate("quiz", "title");
    res.json({ success:true, data: top });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};
