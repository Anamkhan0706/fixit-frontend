import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";

function App() {
  const token = localStorage.getItem("fixit_token");

  return (
    <Routes>
      {/* First-time users go to Login */}
      <Route
        path="/"
        element={
          token ? (
            <Landing />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer pages */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/professionals/:id"
        element={<ProfessionalDetail />}
      />

      {/* Professional pages */}
      <Route
        path="/professional-dashboard"
        element={<ProfessionalDashboard />}
      />
    </Routes>
  );
}

export default App;