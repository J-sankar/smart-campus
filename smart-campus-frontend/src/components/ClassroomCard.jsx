import React from "react";

export default function ClassroomCard({ room, status, onClick }) {
  const colors = {
    available: "#ccf6c5",
    occupied: "#f8d8d8",
    partial: "#ffe7a5",
    ghost: "#ffedd5",
  };

  const statusLabels = {
    available: "Available now",
    occupied: "Occupied",
    partial: "Partially Filled",
    ghost: "⚠️ Ghost Booking",
  };

  const occupancy = room.liveStatus?.currentOccupancy || 0;
  const capacity = room.capacity || 0;
  
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        backgroundColor: colors[status] || "#f0f0f0",
        border: status === "ghost" ? "2px solid #f97316" : "none" // Extra border for ghosts
      }}
    >
      <h3>{room.roomId}</h3> {/* Display Room Number */}
      
      <p style={{ fontWeight: "bold", color: "#333" }}>
        {statusLabels[status] || "Unknown"}
      </p>

      <p style={{ fontSize: 14, marginTop: 8, color: "#1e1e1e" }}>
        👥 Seats: {occupancy} / {capacity}
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
