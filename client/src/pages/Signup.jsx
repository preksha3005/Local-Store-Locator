import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Auth.css";
import Navbar from "../components/Navbar";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role") || "user";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Signup success:", res.data);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Create {role === "owner" ? "Store Owner" : "User"} Account</h1>

          <p className="auth-subtitle">
            {role === "owner"
              ? "List your store and reach nearby customers"
              : "Discover local stores around you"}
          </p>

          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to={`/login?role=${role}`}>Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
