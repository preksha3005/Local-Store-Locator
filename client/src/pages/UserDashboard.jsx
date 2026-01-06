import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarLogin from "../components/NavbarLogin";
import api from "../api/axios";
import "../utils/fixLeafletIcons";
import "../styles/Dashboard.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function UserDashboard() {
  const [position, setPosition] = React.useState([18.5246, 73.8786]);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchText) return;

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: searchText,
          },
        }
      );

      if (res.data.length === 0) {
        alert("Location not found");
        return;
      }

      const lat = parseFloat(res.data[0].lat);
      const lng = parseFloat(res.data[0].lon);

      setPosition([lat, lng]);
      fetchNearbyStores(lat, lng);
    } catch (error) {
      alert("Error fetching location");
      console.error(error);
    }
  };

  useEffect(() => {
    api
      .get("auth/me")
      .then((res) => {
        if (res.data.role !== "user") {
          navigate("/login");
        } else {
          setUser(res.data);
        }
        // fetchNearbyStores(position[0], position[1]);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  // 📍 Fetch nearby stores from backend
  const fetchNearbyStores = async (lat, lng) => {
    try {
      const res = await api.get("/stores/nearby", {
        params: { lat, lng },
      });
      setStores(res.data);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <NavbarLogin role={user.role} userName={user.name} />
      <div className="dashboard-container">
        <h2>Find stores near you</h2>

        {/* 🔍 Search bar */}
        <div className="location-box">
          <input
            type="text"
            placeholder="Enter your area or address"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="location-input"
          />
          <button className="primary-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* 🗺️ Map */}
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          key={position.toString()}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* 📍 User marker (draggable) */}
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                setPosition([lat, lng]);
                fetchNearbyStores(lat, lng);
              },
            }}
          >
            <Popup>Your location</Popup>
          </Marker>

          {/* 🏪 Store markers (fixed) */}
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

        {/* 📋 Store list */}
        <div className="stores-section">
          <h3>Nearby Stores</h3>

          {stores.length === 0 && <p>No stores found nearby.</p>}

          {stores.map((store) => (
            <div key={store._id} className="store-card">
              <p>
                <strong>{store.name}</strong>
              </p>
              <p>{store.category}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
