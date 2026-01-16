import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassroomCard from "../components/ClassroomCard";
import axios from "axios";
import socketService from "../services/socket.js";

export default function Dashboard({ role, onLogout }) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter dropdown state ---
  const [filterStatus, setFilterStatus] = useState("all");

  // 1️⃣ Fetch Initial Data on Load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        setRooms(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Could not load classroom data.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 2️⃣ Listen for Real-Time Updates via WebSocket
  useEffect(() => {
    const socket = socketService.getSocket();

    const handleUpdate = (data) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.roomId === data.roomId) {
            return {
              ...room,
              liveStatus: {
                ...room.liveStatus,
                currentOccupancy: data.occupancy,
                isGhost: data.isGhost,
              },
              capacity: data.capacity || room.capacity,
            };
          }
          return room;
        })
      );
    };

    socket.on("room_update", handleUpdate);
    return () => socket.off("room_update", handleUpdate);
  }, []);

  // 3️⃣ Helper to determine status string based on occupancy
  const getStatus = (room) => {
    if (room.liveStatus?.isGhost) return "ghost";

    const occupancy = room.liveStatus?.currentOccupancy || 0;
    const capacity = room.capacity || 50;

    if (occupancy === 0) return "available";
    else if (occupancy < capacity / 2) return "partial";
    else return "occupied";
  };

  // 4️⃣ Filtered rooms based on dropdown selection
  const filteredRooms =
    filterStatus === "all"
      ? rooms
      : rooms.filter((room) => getStatus(room) === filterStatus);

  if (loading) return <div style={{ padding: 24 }}>Loading Campus Map...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 28 }}>
      {/* Top Bar */}
      <div className="app-topbar" style={styles.header}>
        <div>
          <h2 style={styles.title}>Live Classroom Occupancy</h2>
          <p style={styles.subtitle}>Real-time availability across campus</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* --- Status Filter Dropdown --- */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: 500 }}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontWeight: 500,
            background: "#ffffff",
          }}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="partial">Partially Filled</option>
          <option value="occupied">Occupied</option>
          <option value="ghost">Ghost Booking</option>
        </select>
      </div>

      {/* Classroom Cards Grid */}
      <div style={styles.grid}>
        {filteredRooms.map((room) => (
          <ClassroomCard
            key={room.roomId}
            room={room}
            status={getStatus(room)}
            onClick={() => navigate(`/room/${room.roomId}`)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
};
