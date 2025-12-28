import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(100, 181, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {token ? (
        <Dashboard />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
          }}
        >
          <h1
            style={{
              color: "#64b5f6",
              fontSize: "3em",
              marginBottom: "30px",
              textAlign: "center",
              textShadow: "0 0 20px rgba(100, 181, 246, 0.3)",
            }}
          >
            AI Sales CRM
          </h1>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Register />
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}
