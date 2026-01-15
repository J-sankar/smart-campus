import React from "react";

export default function ClassroomCard({ room, status, onClick }) {
  const colors = {
    available: "#ccf6c5",
    occupied: "#f8d8d8",
    partial: "#ffe7a5",
  };

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        backgroundColor: colors[status] || "#c3ecf6",
      }}
    >
      <h3>{room.name}</h3>
      <p>
        {status === "available" && "Available now"}
        {status === "occupied" && "Occupied"}
        {status === "partial" && "Free soon"}
      </p>
      <p style={{ fontSize: 12, marginTop: 8, color: "#1e1e1e", }}>
        Seats: {room.occupiedSeats} / {room.totalSeats}
      </p>
    </div>
  );
}

const styles = {
  card: {
    padding: 20,
    borderRadius: 16,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};
