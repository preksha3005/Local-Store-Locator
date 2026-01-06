import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import Navbar from "../components/Navbar";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
    <Navbar/>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Find nearby local stores, <br />
            instantly.
          </h1>

          <p>
            Discover trusted kirana, stationery, and small shops around you —
            all on one simple map.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => navigate("/register?role=user")}
            >
              Find Stores Near Me
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register?role=owner")}
            >
              List My Store
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="map-mock">
            <span>📍 Map preview</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Local Store Locator?</h2>

        <div className="feature-cards">
          <div className="card">
            <h3>📍 Discover Nearby</h3>
            <p>See verified local stores around your location in seconds.</p>
          </div>

          <div className="card">
            <h3>🏪 For Small Businesses</h3>
            <p>Help nearby customers find your store without ads or noise.</p>
          </div>

          <div className="card">
            <h3>⚡ Simple & Fast</h3>
            <p>No clutter. No spam. Just clean local discovery.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
