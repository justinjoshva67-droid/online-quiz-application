import Quiz from "../models/Quiz.js";
import Joi from "joi";

const quizSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  timeLimitMinutes: Joi.number().min(1).max(240).default(10),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).min(2).required(),
    correctAnswer: Joi.number().required(),
    marks: Joi.number().default(1)
  })).min(1).required()
});

export const createQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success:false, message: "Admin only" });
    const { error } = quizSchema.validate(req.body);
    if (error) return res.status(400).json({ success:false, message: error.details[0].message });
    const quiz = await Quiz.create(req.body);
    res.json({ success:true, data: quiz });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const { page=1, limit=10, search='' } = req.query;
    const q = search ? { $text: { $search: search } } : {};
    const skips = (page-1)*limit;
    const total = await Quiz.countDocuments(q);
    const quizzes = await Quiz.find(q).skip(skips).limit(Number(limit)).select("title description timeLimitMinutes createdAt");
    res.json({ success:true, data:{ total, page:Number(page), quizzes } });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select("-questions.correctAnswer");
    if (!quiz) return res.status(404).json({ success:false, message: "Quiz not found" });
    res.json({ success:true, data: quiz });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: "Server error" });
  }
};
