import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post("/auth/register", form); alert("Registered. Please login."); nav("/login"); } catch (err) { alert(err.response?.data?.message || "Registration failed"); }
  };
  return (<div className="card"><h2>Register</h2><form onSubmit={handleSubmit}><input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /><button type="submit">Register</button></form></div>);
}
