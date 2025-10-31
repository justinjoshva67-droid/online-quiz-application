import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
export default function ResultPage() {
  const [results, setResults] = useState([]);
  useEffect(() => { API.get("/result/my").then(res => setResults(res.data.data)).catch(err => { console.error(err); alert("Please login to see results"); }); }, []);
  return (<div><h2>My Results</h2><div className="list">{results.map(r => (<div className="card small" key={r._id}><h3>{r.quiz?.title || "Quiz"}</h3><p>Score: {r.score} / {r.total}</p><p>Taken: {new Date(r.createdAt).toLocaleString()}</p></div>))}</div></div>);
}
