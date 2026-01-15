import React from "react";

const timeSlots = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00"
];

export default function CalendarGrid({ room }) {
  return (
    <div style={styles.container}>
      <h3>{room} – Daily Schedule</h3>

      <div style={styles.grid}>
        {timeSlots.map(time => (
          <div key={time} style={styles.slot}>
            {time} — Available
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  slot: {
    backgroundColor: "#c3ecf6",
    padding: 14,
    borderRadius: 8,
    textAlign: "center",
  },
};
