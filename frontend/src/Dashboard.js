import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "./api";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState({});
  const [editing, setEditing] = useState(null);

  const loadLeads = async () => {
    try {
      const data = await api.get("/leads");
      setLeads(data);
    } catch (error) {
      alert("Failed to load leads");
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const addLead = async () => {
    try {
      await api.post("/leads", lead);
      setLead({});
      loadLeads();
    } catch (error) {
      alert("Failed to add lead");
    }
  };

  const updateLead = async (id, updates) => {
    try {
      await api.put(`/leads/${id}`, updates);
      loadLeads();
      setEditing(null);
    } catch (error) {
      alert("Failed to update lead");
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        loadLeads();
      } catch (error) {
        alert("Failed to delete lead");
      }
    }
  };

  const stages = [
    "Prospect",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];
  const priorities = ["High", "Medium", "Low"];

  // Data for charts
  const priorityData = priorities.map((p) => ({
    name: p,
    value: leads.filter((l) => l.priority === p).length,
  }));

  const stageData = stages.map((s) => ({
    name: s,
    count: leads.filter((l) => l.stage === s).length,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Sales CRM Dashboard</h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={{ marginBottom: 20 }}
      >
        Logout
      </button>

      {/* Add Lead Form */}
      <div style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
        <h3>Add New Lead</h3>
        <input
          placeholder="Name"
          value={lead.name || ""}
          onChange={(e) => setLead({ ...lead, name: e.target.value })}
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          placeholder="Email"
          value={lead.email || ""}
          onChange={(e) => setLead({ ...lead, email: e.target.value })}
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          placeholder="Company"
          value={lead.company || ""}
          onChange={(e) => setLead({ ...lead, company: e.target.value })}
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          placeholder="Phone"
          value={lead.phone || ""}
          onChange={(e) => setLead({ ...lead, phone: e.target.value })}
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <textarea
          placeholder="Message"
          value={lead.message || ""}
          onChange={(e) => setLead({ ...lead, message: e.target.value })}
          style={{
            display: "block",
            margin: "10px 0",
            width: "100%",
            height: 60,
          }}
        />
        <button onClick={addLead}>Submit Lead</button>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <div>
          <h4>Leads by Priority</h4>
          <PieChart width={300} height={300}>
            <Pie
              data={priorityData}
              cx={150}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <h4>Sales Pipeline</h4>
          <BarChart width={400} height={300} data={stageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Leads Table */}
      <h3>Leads ({leads.length})</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Company</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Score</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Priority</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Stage</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>AI Action</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l._id}>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editing === l._id ? (
                  <input
                    value={l.name}
                    onChange={(e) =>
                      setLeads(
                        leads.map((lead) =>
                          lead._id === l._id
                            ? { ...lead, name: e.target.value }
                            : lead
                        )
                      )
                    }
                  />
                ) : (
                  l.name
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {l.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editing === l._id ? (
                  <input
                    value={l.company || ""}
                    onChange={(e) =>
                      setLeads(
                        leads.map((lead) =>
                          lead._id === l._id
                            ? { ...lead, company: e.target.value }
                            : lead
                        )
                      )
                    }
                  />
                ) : (
                  l.company || "N/A"
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {l.score}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editing === l._id ? (
                  <select
                    value={l.priority}
                    onChange={(e) =>
                      setLeads(
                        leads.map((lead) =>
                          lead._id === l._id
                            ? { ...lead, priority: e.target.value }
                            : lead
                        )
                      )
                    }
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                ) : (
                  l.priority
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editing === l._id ? (
                  <select
                    value={l.stage}
                    onChange={(e) =>
                      setLeads(
                        leads.map((lead) =>
                          lead._id === l._id
                            ? { ...lead, stage: e.target.value }
                            : lead
                        )
                      )
                    }
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  l.stage
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {l.action}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editing === l._id ? (
                  <>
                    <button
                      onClick={() =>
                        updateLead(l._id, {
                          name: l.name,
                          company: l.company,
                          priority: l.priority,
                          stage: l.stage,
                        })
                      }
                    >
                      Save
                    </button>
                    <button onClick={() => setEditing(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditing(l._id)}>Edit</button>
                    <button onClick={() => deleteLead(l._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
