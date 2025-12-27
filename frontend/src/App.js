import { useEffect, useState } from "react";

export default function App() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leads")
      .then((res) => res.json())
      .then(setLeads);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Sales CRM</h2>
      {leads.map((l) => (
        <div key={l._id}>
          <b>{l.name}</b> | Score: {l.score} | {l.priority}
        </div>
      ))}
    </div>
  );
}
