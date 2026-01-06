import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddStore from "./pages/AddStore";
import EditStore from "./pages/EditStore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Dashboards */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-store" element={<AddStore/>}/>
        <Route path="/owner/edit-store/:id" element={<EditStore/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
