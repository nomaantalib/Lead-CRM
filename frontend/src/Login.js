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
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h3>Login</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <button onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
