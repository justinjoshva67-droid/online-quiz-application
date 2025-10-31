import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  options: [{ 
    type: String 
  }],
  correctAnswer: { 
    type: Number, 
    required: true 
  },
  marks: { 
    type: Number, 
    default: 2 
  }
});

const quizSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeLimitMinutes: { 
    type: Number, 
    default: 30 
  },
  questions: [questionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'general'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
quizSchema.index({ title: "text", description: "text" });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ category: 1 });

// Virtual for total marks
quizSchema.virtual('totalMarks').get(function() {
  return this.questions.reduce((total, q) => total + (q.marks || 2), 0);
});

// Virtual for attempted count
quizSchema.virtual('attemptedCount', {
  ref: 'Result',
  localField: '_id',
  foreignField: 'quiz',
  count: true
});

// Virtual for average score
quizSchema.virtual('averageScore', {
  ref: 'Result',
  localField: '_id',
  foreignField: 'quiz',
  pipeline: [
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$score' }
      }
    }
  ]
});

export default mongoose.model("Quiz", quizSchema);
