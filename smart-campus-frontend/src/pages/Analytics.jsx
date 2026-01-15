import React, { useEffect, useState } from "react";

export default function Analytics({ onLogout }) {
  const [data, setData] = useState([]);

  // Mock fetching usage stats
  useEffect(() => {
    const mockData = [
      { room: "Room A", usage: 75 },
      { room: "Room B", usage: 90 },
      { room: "Lab 1", usage: 50 },
      { room: "Lab 2", usage: 30 },
    ];
    setData(mockData);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Campus Analytics</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div style={styles.cardContainer}>
        {data.map((room) => (
          <div key={room.room} style={styles.card}>
            <h3>{room.room}</h3>
            <p>Usage: {room.usage}%</p>
            <div style={styles.barBackground}>
              <div
                style={{
                  ...styles.barForeground,
                  width: `${room.usage}%`,
                  backgroundColor:
                    room.usage < 50 ? "#5cdb6d" : room.usage < 80 ? "#f9ab00" : "#ea4335",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, color: "#1e1e1e", fontStyle: "italic" }}>
        *This is mock data. Real analytics will use occupancy logs & AI predictions.*
      </p>
    </div>
  );
}

const styles = {
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  barBackground: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    height: 16,
    marginTop: 12,
  },
  barForeground: {
    height: "100%",
    borderRadius: 8,
  },
};
