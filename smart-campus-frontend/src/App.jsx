import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoomDetail from "./pages/RoomDetail";
import Analytics from "./pages/Analytics";

export default function App() {
  const [role, setRole] = useState(null);

  const handleLogout = () => setRole(null);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard role={role} onLogout={handleLogout} />}
        />
        <Route
          path="/room/:roomName"
          element={<RoomDetail role={role} onLogout={handleLogout} />}
        />
        {role === "admin" && (
          <Route
            path="/analytics"
            element={<Analytics onLogout={handleLogout} />}
          />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
