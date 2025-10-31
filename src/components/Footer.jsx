import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="muted">© {new Date().getFullYear()} CAMPUS PRACTICO </div>
      <div style={{ marginLeft: 12, color: "#94a3b8", fontSize: "0.9rem" }}>Hecho por Brayan</div>
    </footer>
  );
}
