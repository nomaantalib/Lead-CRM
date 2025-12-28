import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
  return <Dashboard />;
}
