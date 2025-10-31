import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Result from "./models/Result.js";
import bcrypt from "bcryptjs";

dotenv.config();

const users = [
  { name: "Admin", email: "admin@quiz.com", password: "admin123", role: "admin" },
  { name: "Teacher One", email: "teacher1@quiz.com", password: "teacher123", role: "teacher" },
  { name: "Teacher Two", email: "teacher2@quiz.com", password: "teacher123", role: "teacher" },
  { name: "Student One", email: "student1@quiz.com", password: "student123", role: "student" },
  { name: "Student Two", email: "student2@quiz.com", password: "student123", role: "student" },
  { name: "Student Three", email: "student3@quiz.com", password: "student123", role: "student" }
];

const quizzes = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your JavaScript knowledge",
    timeLimitMinutes: 30,
    questions: [
      {
        question: "What is JavaScript?",
        options: ["Programming Language", "Markup Language", "Database", "OS"],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "What is the correct way to declare a variable?",
        options: ["var x = 5", "variable x = 5", "x := 5", "let x => 5"],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Model", "Digital Object Memory", "Display Object Management"],
        correctAnswer: 0,
        marks: 2
      }
    ]
  },
  {
    title: "React Basics",
    description: "Essential React concepts test",
    timeLimitMinutes: 45,
    questions: [
      {
        question: "What is JSX?",
        options: ["JavaScript XML", "Java Syntax", "JSON XML", "JavaScript Extension"],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "What hook is used for side effects?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "What is the virtual DOM?",
        options: [
          "A lightweight copy of the actual DOM",
          "A new browser feature",
          "A database system",
          "A JavaScript engine"
        ],
        correctAnswer: 0,
        marks: 2
      }
    ]
  },
  {
    title: "Web Development Quiz",
    description: "Test your web development knowledge",
    timeLimitMinutes: 40,
    questions: [
      {
        question: "What is HTML?",
        options: ["Markup Language", "Programming Language", "Styling Language", "Database"],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Creative Style System",
          "Colorful Style Sheets"
        ],
        correctAnswer: 0,
        marks: 2
      },
      {
        question: "Which protocol is used for secure data transfer?",
        options: ["HTTPS", "HTTP", "FTP", "SMTP"],
        correctAnswer: 0,
        marks: 2
      }
    ]
  }
];

const generateResults = async (users, quizzes) => {
  const results = [];
  const students = users.filter(u => u.role === 'student');
  const now = new Date();

  for (const student of students) {
    for (const quiz of quizzes) {
      // Generate 3 attempts per quiz for each student
      for (let i = 0; i < 3; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const score = Math.floor(Math.random() * 100);
        const totalQuestions = quiz.questions.length;
        const correctAnswers = Math.floor((score / 100) * totalQuestions);
        
        results.push({
          user: student._id,
          quiz: quiz._id,
          score,
          totalQuestions,
          correctAnswers,
          timeTaken: Math.floor(Math.random() * quiz.timeLimitMinutes),
          completedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000)
        });
      }
    }
  }
  return results;
};

const createSeed = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Result.deleteMany({});

    // Create users
    const createdUsers = await Promise.all(
      users.map(async user => {
        const hashed = await bcrypt.hash(user.password, 10);
        return await User.create({ ...user, password: hashed });
      })
    );
    console.log('Users created successfully');

    // Create quizzes
    const teacher = createdUsers.find(u => u.role === 'teacher');
    const createdQuizzes = await Promise.all(
      quizzes.map(async quiz => {
        return await Quiz.create({ ...quiz, createdBy: teacher._id });
      })
    );
    console.log('Quizzes created successfully');

    // Generate and create results
    const results = await generateResults(createdUsers, createdQuizzes);
    await Result.insertMany(results);
    console.log('Results created successfully');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

createSeed();
