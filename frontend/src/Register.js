import { useState } from "react";
import { api } from "./api";

export default function Register() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      alert("Registered! Now login.");
      setForm({});
    } catch (error) {
      alert("Registration failed: " + error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "20px auto",
        backgroundColor: "#1e1e1e",
        borderRadius: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        color: "#ffffff",
      }}
    >
      <h3
        style={{
          color: "#64b5f6",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "1.8em",
        }}
      >
        Register
      </h3>
      <input
        placeholder="Name"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{
          display: "block",
          margin: "10px 0",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #555",
          backgroundColor: "#2a2a2a",
          color: "#fff",
          fontSize: "16px",
        }}
      />
      <input
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{
          display: "block",
          margin: "10px 0",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #555",
          backgroundColor: "#2a2a2a",
          color: "#fff",
          fontSize: "16px",
        }}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password || ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={{
          display: "block",
          margin: "10px 0",
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #555",
          backgroundColor: "#2a2a2a",
          color: "#fff",
          fontSize: "16px",
        }}
      />
      <button
        onClick={register}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: loading ? "#555" : "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "10px",
          boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#45a049";
            e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.5)";
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#4caf50";
            e.target.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.3)";
          }
        }}
      >
        {loading ? " Registering..." : " Register"}
      </button>
    </div>
  );
}
