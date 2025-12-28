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
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const addLead = async () => {
    if (!lead.name || !lead.email) {
      alert("Name and Email are required");
      return;
    }
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

  const rescoreLead = async (id) => {
    try {
      await api.put(`/leads/${id}/score`);
      loadLeads();
      alert("Lead re-scored!");
    } catch (error) {
      alert("Failed to re-score lead");
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
  const priorities = ["Very High", "High", "Medium", "Low"];

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
    <>
      <div
        style={{
          padding: 20,
          minHeight: "100vh",
          backgroundColor: "#121212",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2
          style={{
            color: "#64b5f6",
            textAlign: "center",
            marginBottom: 30,
            fontSize: "2.5em",
            textShadow: "0 0 10px rgba(100, 181, 246, 0.3)",
          }}
        >
          AI Sales CRM Dashboard
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(255, 68, 68, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow = "0 6px 20px rgba(255, 68, 68, 0.5)")
          }
          onMouseOut={(e) =>
            (e.target.style.boxShadow = "0 4px 15px rgba(255, 68, 68, 0.3)")
          }
        >
          Logout
        </button>

        {/* Add Lead Form */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "15px",
            padding: 25,
            marginBottom: 30,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            style={{
              color: "#64b5f6",
              marginBottom: 15,
              fontSize: "1.5em",
              textAlign: "center",
            }}
          >
            Add New Lead
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#bbb",
              backgroundColor: "#2a2a2a",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #444",
            }}
          >
            <strong style={{ color: "#64b5f6" }}>Pro Tip:</strong> Include
            keywords like "budget", "urgent", "approved", "demo" in your message
            for higher AI scores!
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <input
              placeholder="Name"
              value={lead.name || ""}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #555",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            <input
              placeholder="Email"
              value={lead.email || ""}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #555",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            <input
              placeholder="Company"
              value={lead.company || ""}
              onChange={(e) => setLead({ ...lead, company: e.target.value })}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #555",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            <input
              placeholder="Phone"
              value={lead.phone || ""}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #555",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>
          <textarea
            placeholder="Message (include keywords like 'budget approved', 'urgent need', 'schedule demo')"
            value={lead.message || ""}
            onChange={(e) => setLead({ ...lead, message: e.target.value })}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #555",
              backgroundColor: "#2a2a2a",
              color: "#fff",
              fontSize: "14px",
              height: 80,
              marginBottom: "15px",
              resize: "vertical",
            }}
          />
          <button
            onClick={addLead}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#45a049";
              e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#4caf50";
              e.target.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.3)";
            }}
          >
            Submit Lead
          </button>
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
        <h3
          style={{
            color: "#64b5f6",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.8em",
          }}
        >
          Leads ({leads.length})
        </h3>
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#1e1e1e",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#2a2a2a",
                  borderBottom: "2px solid #64b5f6",
                }}
              >
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  👤 Name
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Company
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Priority
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Stage
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  AI Action
                </th>
                <th
                  style={{
                    border: "1px solid #444",
                    padding: "12px",
                    color: "#64b5f6",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l._id}
                  style={{
                    backgroundColor: "#2a2a2a",
                    borderBottom: "1px solid #444",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#333")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2a2a2a")
                  }
                >
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "12px",
                      color: "#fff",
                      backgroundColor: "transparent",
                    }}
                  >
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
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #555",
                          backgroundColor: "#1e1e1e",
                          color: "#fff",
                        }}
                      />
                    ) : (
                      l.name
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "12px",
                      color: "#fff",
                      backgroundColor: "transparent",
                    }}
                  >
                    {l.email}
                  </td>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "12px",
                      color: "#fff",
                      backgroundColor: "transparent",
                    }}
                  >
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
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #555",
                          backgroundColor: "#1e1e1e",
                          color: "#fff",
                        }}
                      />
                    ) : (
                      l.company || "N/A"
                    )}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    <span
                      style={{
                        color:
                          l.score >= 80
                            ? "#28a745"
                            : l.score >= 60
                            ? "#ffc107"
                            : l.score >= 40
                            ? "#fd7e14"
                            : "#dc3545",
                        fontWeight: "bold",
                      }}
                    >
                      {l.score}
                    </span>
                    <br />
                    <small style={{ color: "#666" }}>
                      {l.score >= 80
                        ? "Hot"
                        : l.score >= 60
                        ? "Warm"
                        : l.score >= 40
                        ? "Medium"
                        : "Cold"}
                    </small>
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
                        <button onClick={() => rescoreLead(l._id)}>
                          Re-score
                        </button>
                        <button onClick={() => deleteLead(l._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
