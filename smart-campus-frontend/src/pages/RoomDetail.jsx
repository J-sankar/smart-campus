import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socketService from "../services/socket";
import CalendarGrid from "../components/CalendarGrid";
import QRCheckInModal from "../components/QRCheckInModal";

/**
 * RoomDetail
 * -----------
 * Shows detailed info for a room including live occupancy, status, and weekly schedule.
 * Top panel is pressed-style, status highlighted.
 * Admin can trigger QR Check-In modal.
 */
export default function RoomDetail({ role, onLogout }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [qrOpen, setQrOpen] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch room data from backend
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to fetch room:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  // Listen for live updates via WebSocket
  useEffect(() => {
    const socket = socketService.getSocket();
    const handleUpdate = (data) => {
      if (data.roomId === roomId) {
        setRoom((prev) => ({
          ...prev,
          liveStatus: {
            ...prev.liveStatus,
            currentOccupancy: data.occupancy,
            isGhost: data.isGhost,
            lastUpdated: new Date().toISOString()
          },
          capacity: data.capacity || prev.capacity
        }));
      }
    };
    socket.on("room_update", handleUpdate);
    return () => socket.off("room_update", handleUpdate);
  }, [roomId]);

  // Status display logic
  const getStatusDisplay = () => {
    if (!room) return { text: "Loading...", color: "#ccc", bg: "#f0f0f0", border: "#ccc" };
    const isGhost = room.liveStatus?.isGhost;
    const occupancy = room.liveStatus?.currentOccupancy || 0;
    const capacity = room.capacity || 50;

    if (isGhost) return { text: "GHOST BOOKING", color: "#727272", bg: "#dfdfdf", border: "#858585" };
    if (occupancy === 0) return { text: "✅ Available", color: "#15803d", bg: "#dcfce7", border: "#22c55e" };
    if (occupancy < capacity / 2) return { text: "Partially Filled", color: "#854d0e", bg: "#fef9c3", border: "#eab308" };
    return { text: "Occupied", color: "#b91c1c", bg: "#fee2e2", border: "#ef4444" };
  };

  if (loading) return <div style={{ padding: 24 }}>Loading Room Details...</div>;
  if (!room) return <div style={{ padding: 24 }}>Room not found</div>;

  const status = getStatusDisplay();

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      {/* Top Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => navigate("/")}>← Back</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* 🔴 Live Status Panel */}
      <div
        className="pressed-panel"
        style={{ "--status-color": status.border, "--status-bg": status.bg }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#333" }}>Room {room.roomId}</h1>
          <p style={{ color: "#666", marginTop: "4px" }}>
            Last Updated: {new Date(room.liveStatus?.lastUpdated).toLocaleTimeString()}
          </p>

          {/* Status Badge */}
          <div style={{
            display: "inline-block",
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor: status.bg,
            color: status.color,
            fontWeight: "bold",
            border: `1px solid ${status.border}`
          }}>
            {status.text}
          </div>
        </div>

        {/* Big Counter */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "4rem", fontWeight: "bold", color: status.color, lineHeight: 1 }}>
            {room.liveStatus?.currentOccupancy || 0}
            <span style={{ fontSize: "1.5rem", color: "#999", marginLeft: 10 }}>
              / {room.capacity}
            </span>
          </div>
          <p style={{ color: "#666", margin: 0 }}>People Detected</p>
        </div>
      </div>

      {/* Admin reservation Button */}
      {role === "admin" && (
        <button
          style={{
            marginBottom: 24,
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
          onClick={() => setQrOpen(true)}
        >
          📷 QR Check-In / Occupy
        </button>
      )}

      {/* Weekly Calendar */}
      <h3 style={{ marginBottom: 16 }}>📅 Weekly Schedule</h3>
      <CalendarGrid room={roomId} />

      {/* QR Modal */}
      {qrOpen && <QRCheckInModal room={roomId} onClose={() => setQrOpen(false)} />}
    </div>
  );
}
