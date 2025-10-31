import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
export default function Leaderboard() {
  const [top, setTop] = useState([]);
  useEffect(()=>{ API.get('/result/top').then(res=>setTop(res.data.data)).catch(console.error); },[]);
  return (<div><h2>Leaderboard</h2><div className="list">{top.map((t,i)=> (<div className="card small" key={t._id}><h3>#{i+1} {t.user?.name}</h3><p>Quiz: {t.quiz?.title}</p><p>Score: {t.score}</p></div>))}</div></div>);
}
