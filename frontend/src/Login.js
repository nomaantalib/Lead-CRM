import { useState } from "react";
import { api } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        window.location.reload();
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert("Login failed: " + error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "50px auto",
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
        Login
      </h3>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          margin: "15px 0",
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          margin: "15px 0",
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
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: loading ? "#555" : "#64b5f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "10px",
          boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#42a5f5";
            e.target.style.boxShadow = "0 6px 20px rgba(100, 181, 246, 0.5)";
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#64b5f6";
            e.target.style.boxShadow = "0 4px 15px rgba(100, 181, 246, 0.3)";
          }
        }}
      >
        {loading ? " Logging in..." : " Login"}
      </button>
    </div>
  );
}
