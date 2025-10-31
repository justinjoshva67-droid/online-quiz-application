import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
export default function Analytics(){
  const [data, setData] = useState(null);
  useEffect(()=>{ API.get('/admin/trends').then(res=>{ const labels = res.data.data.map(r=>r._id); const values = res.data.data.map(r=>r.avg); setData({ labels, datasets:[{ label:'Average Score', data: values }] }); }).catch(console.error); },[]);
  if(!data) return <div>Loading...</div>;
  return (<div><h2>Analytics - Last 30 days</h2><Line data={data} /></div>);
}
