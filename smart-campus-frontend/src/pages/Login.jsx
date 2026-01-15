import React from "react";

export default function Login({ onLogin }) {
  return (
    <div style={styles.container}>
      <h1>Smart Campus</h1>
      <p>Select your role</p>

      <div style={styles.buttons}>
        <button onClick={() => onLogin("student")}>Student Login</button>
        <button onClick={() => onLogin("admin")}>Admin Login</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  buttons: {
    display: "flex",
    gap: 16,
    marginTop: 24,
  },
};
