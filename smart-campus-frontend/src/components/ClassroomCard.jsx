import React, { useState } from "react";

/**
 * ClassroomCard
 * --------------
 * Displays a classroom as a physical push-button card.
 * Shows room ID, occupancy, progress bar, and status badge.
 * Hover & pressed effects mimic the buttons exactly.
 */
export default function ClassroomCard({ room, status, onClick }) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Occupancy / capacity
  const occupancy = room.liveStatus?.currentOccupancy || 0;
  const capacity = room.capacity || 0;
  const percent = capacity ? Math.round((occupancy / capacity) * 100) : 0;

  // Map status to color & label
  const statusMap = {
    available: { label: "Available", color: "#34a853" },
    partial: { label: "Partially Filled", color: "#f9ab00" },
    occupied: { label: "Occupied", color: "#ea4335" },
    ghost: { label: "Ghost Booking", color: "#ff7daf" },
  };
  const { label, color } = statusMap[status];

  // 3D transform & shadow (matches button)
  const getTranslateY = () => (pressed ? "translateY(6px)" : hovered ? "translateY(-2px)" : "translateY(0)");
  const getShadow = () => (pressed ? "0 2px 0 #d1d5db" : hovered ? "0 10px 0 #d1d5db" : "0 8px 0 #d1d5db");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 16,
        background: "#ffffff",
        transform: getTranslateY(),
        boxShadow: getShadow(),
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
    >
      {/* Top face of the card */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #e5e7eb"
      }}>
        {/* Header: Room ID + Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1e1e1e" }}>{room.roomId}</h3>
          <span style={{
            backgroundColor: color,
            color: "#ffffff",
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 999,
            fontWeight: 500,
          }}>
            {label}
          </span>
        </div>

        {/* Seats info */}
        <p style={{ marginTop: 12, fontSize: 14, color: "#1e1e1e" }}>
          {occupancy} / {capacity} seats occupied
        </p>

        {/* Progress bar */}
        <div style={{ height: 8, background: "#f0f0f0", borderRadius: 8, marginTop: 10, overflow: "hidden" }}>
          <div style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: color,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
