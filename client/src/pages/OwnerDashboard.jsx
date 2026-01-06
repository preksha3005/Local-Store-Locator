import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import NavbarLogin from "../components/NavbarLogin";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("auth/me")
      .then((res) => {
        if (res.data.role !== "owner") {
          navigate("/login");
        } else {
          setUser(res.data);
          fetchMyStores();
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const fetchMyStores = async () => {
    try {
      const res = await api.get("/stores/my");
      setStores(res.data);
    } catch (error) {
      console.error("Failed to fetch owner stores", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this store?")) return;

    try {
      await api.delete(`/stores/delete/${id}`);
      setStores((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete store");
    }
  };

  if (!user) return <p>Loading...</p>;

  const mapCenter =
    stores.length > 0
      ? [stores[0].location.coordinates[1], stores[0].location.coordinates[0]]
      : [18.5246, 73.8786]; // fallback

  return (
    <>
      <NavbarLogin role={user.role} userName={user.name} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Your Stores</h2>
          <button
            className="primary-btn"
            onClick={() => navigate("/owner/add-store")}
          >
            Add Store
          </button>
        </div>

        {/* 🗺️ Map */}
        <div className="map-wrapper">
          <MapContainer center={mapCenter} zoom={13} className="map-container">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {stores.map((store) => {
              const [lng, lat] = store.location.coordinates;
              return (
                <Marker key={store._id} position={[lat, lng]}>
                  <Popup>
                    <strong>{store.name}</strong>
                    <br />
                    {store.category}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* 📋 Store cards */}
        <div className="stores-section">
          <h3>Your Store Listings</h3>

          {stores.length === 0 && <p>You have not added any stores yet.</p>}

          {stores.map((store) => (
            <div key={store._id} className="store-card">
              <p>
                <strong>{store.name}</strong>
              </p>
              <p>{store.category}</p>

              <div className="store-actions">
                <button
                  className="secondary-btn"
                  onClick={() => navigate(`/owner/edit-store/${store._id}`)}
                >
                  Edit
                </button>
                <button
                  className="danger-btn"
                  onClick={() => handleDelete(store._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
    </>
  );
}

export default OwnerDashboard;
