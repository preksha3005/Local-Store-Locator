import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import NavbarLogin from "../components/NavbarLogin";
import api from "../api/axios";
import axios from "axios";
import "../utils/fixLeafletIcons";
import "../styles/AddStore.css";

/* 🔁 Helper component to recenter map */
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

function AddStore() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");

  const [position, setPosition] = useState([18.5246, 73.8786]); // default
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* 🔐 Owner auth check */
  useEffect(() => {
    api
      .get("auth/me")
      .then((res) => {
        if (res.data.role !== "owner") {
          navigate("/login");
        } else {
          setUser(res.data);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  /* 🔍 Address → lat/lng (axios) */
  const handleAddressSearch = async () => {
    if (!address) return;

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: address,
          },
        }
      );

      if (res.data.length === 0) {
        alert("Address not found");
        return;
      }

      const lat = parseFloat(res.data[0].lat);
      const lng = parseFloat(res.data[0].lon);

      setPosition([lat, lng]); // ✅ marker + map will move
    } catch (error) {
      console.error(error);
      alert("Failed to locate address");
    }
  };

  /* 💾 Save store */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/stores/add", {
        name,
        category,
        lat: position[0],
        lng: position[1],
      });

      navigate("/owner/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to add store");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <NavbarLogin role={user.role} userName={user.name} />

      <div className="add-store-container">
        <h2>Add New Store</h2>

        {/* 📝 Store Form */}
        <form className="store-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category (e.g. Grocery, Bakery)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="location-box">
            <input
              type="text"
              placeholder="Store address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="button"
              className="secondary-btn"
              onClick={handleAddressSearch}
            >
              Locate on Map
            </button>
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Store"}
          </button>
        </form>

        {/* 🗺️ Map */}
        <div className="add-store-map">
          <MapContainer center={position} zoom={14} className="map-container">
            <RecenterMap position={position} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setPosition([lat, lng]);
                },
              }}
            >
              <Popup>Drag to adjust store location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default AddStore;
