import React, { useState } from "react";

export default function QRCheckInModal({ room, onClose }) {
  const [code, setCode] = useState("");

  const handleCheckIn = () => {
    alert(`Checked in ${room} with code: ${code}`);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>QR Check-In for {room}</h3>
        <input
          placeholder="Enter QR Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttons}>
          <button onClick={handleCheckIn}>Check-In</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    minWidth: 320,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 12,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
};
