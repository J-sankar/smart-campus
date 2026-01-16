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

function createRipple(event, color = "rgba(255,255,255,0.6)") {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();

  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);

  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.style.backgroundColor = color;

  button.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
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
