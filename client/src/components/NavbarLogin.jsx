import { Link, useNavigate } from "react-router-dom";
import "../styles/NavbarLogin.css";
import api from "../api/axios";

function NavbarLogin({ role, userName }) {
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("auth/logout");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {role === "user" && (
        <Link to="/user/dashboard" className="navbar-logo">
          Local Store Locator
        </Link>
      )}
      {role === "owner" && (
        <Link to="/owner/dashboard" className="navbar-logo">
          Local Store Locator
        </Link>
      )}

      <div className="navbar-links">
        {/* STORE OWNER NAVBAR */}
        {role === "owner" && (
          <>
            <Link to="/owner/add-store" className="navbar-link">
              Add Store
            </Link>
          </>
        )}

        {/* COMMON RIGHT SIDE */}
        <div className="navbar-profile">
          <div className="navbar-avatar">{initial}</div>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarLogin;
