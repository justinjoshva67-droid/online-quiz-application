import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaClock, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import "../styles/quiz.css";
export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/quiz/${id}`);
        setQuiz(res.data.data);
        setAnswers(Array(res.data.data.questions.length).fill(null));
        setTimeLeft((res.data.data.timeLimitMinutes || 10) * 60);
      } catch (err) {
        alert("Please login to take quiz"); nav("/login");
      }
    };
    load();
  }, [id, nav]);
  useEffect(()=>{
    if(timeLeft===null) return;
    if(timeLeft<=0) { submit(); return; }
    const t = setInterval(()=> setTimeLeft(tl => tl-1), 1000);
    return ()=> clearInterval(t);
  }, [timeLeft]);
  const choose = (qIdx, optIdx) => { const newA = [...answers]; newA[qIdx] = optIdx; setAnswers(newA); };
  const submit = async () => {
    if (answers.some(a => a === null)) { if (!window.confirm("Some answers are empty. Submit anyway?")) return; }
    try { const res = await API.post("/result/submit", { quizId: id, answers }); alert(`Submitted. Score: ${res.data.data.score}/${res.data.data.total}`); nav("/results"); } catch (err) { alert(err.response?.data?.message || "Submission failed"); }
  };
  if (!quiz) return <div>Loading...</div>;
  return (<div><h2>{quiz.title}</h2><p>{quiz.description}</p><p>Time left: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</p>{quiz.questions.map((q, i) => (<div key={i} className="card"><p><strong>{i+1}. {q.question}</strong></p><div>{q.options.map((opt, j) => (<label key={j} className={`option ${answers[i] === j ? "selected" : ""}`}><input type="radio" name={`q${i}`} checked={answers[i]===j} onChange={()=>choose(i,j)} />{opt}</label>))}</div></div>))}<button onClick={submit}>Submit Quiz</button></div>);
}
