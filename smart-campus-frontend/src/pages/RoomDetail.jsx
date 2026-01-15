import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarGrid from "../components/CalendarGrid";
import QRCheckInModal from "../components/QRCheckInModal";

export default function RoomDetail({ role, onLogout }) {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")}>← Back</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      <h2 style={{ marginTop: 16 }}>{roomName} – Full Schedule</h2>

      {role === "admin" && (
        <button
          style={{ marginTop: 16 }}
          onClick={() => setQrOpen(true)}
        >
          QR Check-In / Occupy
        </button>
      )}

      <CalendarGrid room={roomName} />

      {qrOpen && <QRCheckInModal room={roomName} onClose={() => setQrOpen(false)} />}
    </div>
  );
}
