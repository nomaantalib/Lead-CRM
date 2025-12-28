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
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h3>Register</h3>
      <input
        placeholder="Name"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password || ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />
      <button onClick={register} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
