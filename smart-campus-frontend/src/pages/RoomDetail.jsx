// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import CalendarGrid from "../components/CalendarGrid";
// import QRCheckInModal from "../components/QRCheckInModal";

// export default function RoomDetail({ role, onLogout }) {
//   const { roomName } = useParams();
//   const navigate = useNavigate();
//   const [qrOpen, setQrOpen] = useState(false);

//   return (
//     <div style={{ padding: 24 }}>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <button onClick={() => navigate("/")}>← Back</button>
//         <button onClick={onLogout}>Logout</button>
//       </div>

//       <h2 style={{ marginTop: 16 }}>{roomName} – Full Schedule</h2>

//       {role === "admin" && (
//         <button
//           style={{ marginTop: 16 }}
//           onClick={() => setQrOpen(true)}
//         >
//           QR Check-In / Occupy
//         </button>
//       )}

//       <CalendarGrid room={roomName} />

//       {qrOpen && <QRCheckInModal room={roomName} onClose={() => setQrOpen(false)} />}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socketService from "../services/socket"; // 👈 Import Socket Singleton
import CalendarGrid from "../components/CalendarGrid";
import QRCheckInModal from "../components/QRCheckInModal";

export default function RoomDetail({ role, onLogout }) {
  const { roomId } = useParams();
  console.log(roomId) // This is the roomId (e.g., "101")
  const navigate = useNavigate();
  
  const [qrOpen, setQrOpen] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch Initial Room Data (REST API)
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        setRoom(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch room:", err);
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  // 2️⃣ Listen for Live Updates (WebSocket)
  useEffect(() => {
    const socket = socketService.getSocket();

    const handleUpdate = (data) => {
      // Only update if the event belongs to THIS room
      if (data.roomId === roomId) {
        setRoom((prev) => ({
          ...prev,
          liveStatus: {
            ...prev.liveStatus,
            currentOccupancy: data.occupancy,
            isGhost: data.isGhost,
            lastUpdated: new Date().toISOString()
          },
          capacity: data.capacity || prev.capacity // Update capacity if changed
        }));
      }
    };

    socket.on("room_update", handleUpdate);

    return () => {
      socket.off("room_update", handleUpdate);
    };
  }, [roomId]);

  // 3️⃣ Helper for Status Logic (Same as Dashboard)
  const getStatusDisplay = () => {
    if (!room) return { text: "Loading...", color: "#ccc", bg: "#f0f0f0" };

    const isGhost = room.liveStatus?.isGhost;
    const occupancy = room.liveStatus?.currentOccupancy || 0;
    const capacity = room.capacity || 50;

    if (isGhost) return { text: "⚠️ GHOST BOOKING", color: "#c05621", bg: "#ffedd5", border: "#f97316" }; // Orange
    
    if (occupancy === 0) {
      return { text: "✅ Available", color: "#15803d", bg: "#dcfce7", border: "#22c55e" }; // Green
    } 
    else if (occupancy < capacity / 2) {
      return { text: "⚡ Partially Filled", color: "#854d0e", bg: "#fef9c3", border: "#eab308" }; // Yellow
    } 
    else {
      return { text: "🔴 Occupied", color: "#b91c1c", bg: "#fee2e2", border: "#ef4444" }; // Red
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading Room Details...</div>;
  if (!room) return <div style={{ padding: 24 }}>Room not found</div>;

  const status = getStatusDisplay();

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => navigate("/")} style={{ cursor: "pointer", padding: "8px 16px" }}>
          ← Back
        </button>
        <button onClick={onLogout} style={{ cursor: "pointer", padding: "8px 16px" }}>
          Logout
        </button>
      </div>

      {/* 🔴 LIVE STATUS CARD */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        border: `2px solid ${status.border}`,
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "32px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#333" }}>Room {room.roomId}</h1>
          <p style={{ color: "#666", marginTop: "4px" }}>
             Last Updated: {new Date(room.liveStatus?.lastUpdated).toLocaleTimeString()}
          </p>
          
          {/* Status Badge */}
          <div style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "8px 16px",
            borderRadius: "8px",
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
           <div style={{ fontSize: "4rem", fontWeight: "bold", color: "#333", lineHeight: 1 }}>
             {room.liveStatus?.currentOccupancy || 0}
             <span style={{ fontSize: "1.5rem", color: "#999", marginLeft: "10px" }}>
               / {room.capacity}
             </span>
           </div>
           <p style={{ color: "#666", margin: 0 }}>People Detected</p>
        </div>
      </div>

      {/* Admin Controls */}
      {role === "admin" && (
        <button
          style={{ 
            marginBottom: 24, 
            padding: "10px 20px", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer" 
          }}
          onClick={() => setQrOpen(true)}
        >
          📷 QR Check-In / Occupy
        </button>
      )}

      {/* Calendar Grid */}
      <h3 style={{ marginBottom: 16 }}>📅 Weekly Schedule</h3>
      <CalendarGrid room={roomId} />

      {qrOpen && <QRCheckInModal room={roomId} onClose={() => setQrOpen(false)} />}
    </div>
  );
}