import React from "react";
import { useNavigate } from "react-router-dom";
import ClassroomCard from "../components/ClassroomCard";

// Rooms with seats info
export const rooms = [
  { name: "Room A", status: "available", totalSeats: 40, occupiedSeats: 10 },
  { name: "Room B", status: "occupied", totalSeats: 35, occupiedSeats: 35 },
  { name: "Lab 1", status: "partial", totalSeats: 25, occupiedSeats: 15 },
  { name: "Lab 2", status: "available", totalSeats: 30, occupiedSeats: 5 },
];

export default function Dashboard({ role, onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Classrooms Available Now</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div style={styles.grid}>
        {rooms.map((room) => (
          // Pass the full room object now
          <ClassroomCard
            key={room.name}
            room={room}         // <-- pass full object
            status={room.status}
            onClick={() => navigate(`/room/${room.name}`)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
};
