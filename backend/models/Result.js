import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Quiz", 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  correctAnswers: { 
    type: Number, 
    required: true 
  },
  timeTaken: { 
    type: Number, 
    required: true 
  },
  answers: [{ 
    type: Number 
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
resultSchema.index({ quiz: 1, user: 1 });
resultSchema.index({ completedAt: -1 });
resultSchema.index({ score: -1 });

// Virtual for percentage score
resultSchema.virtual('percentageScore').get(function() {
  return (this.score / (this.totalQuestions * 2)) * 100;
});

// Method to get user ranking for a quiz
resultSchema.statics.getUserRanking = async function(quizId, userId) {
  const results = await this.find({ quiz: quizId })
    .sort({ score: -1, timeTaken: 1 })
    .lean();
  
  const userRank = results.findIndex(result => 
    result.user.toString() === userId.toString()
  ) + 1;
  
  return {
    rank: userRank,
    totalParticipants: results.length
  };
};

export default mongoose.model("Result", resultSchema);
