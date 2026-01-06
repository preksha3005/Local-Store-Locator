import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/Auth.css";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role") || "user";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login (cookie set by backend)
      await api.post("/auth/login", {
        email,
        password,
      });

      // 2️⃣ Fetch current user via cookie
      const me = await api.get("/auth/me");

      // 3️⃣ Role sanity check
      if (me.data.role !== role) {
        setError(`This account is registered as a ${me.data.role}`);
        return;
      }

      // 4️⃣ Route by role
      if (me.data.role === "user") {
        navigate("/user/dashboard");
      } else if (me.data.role === "owner") {
        navigate("/owner/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <h1>{role === "owner" ? "Owner Login" : "User Login"}</h1>

          <p className="auth-subtitle">
            {role === "owner"
              ? "Manage your store and customers"
              : "Discover nearby local stores"}
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button className="primary-btn" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don’t have an account?
            <Link to={`/register?role=${role}`}>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
