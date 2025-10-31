import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.jpg" alt="logo" style={{ width:30, height:30, borderRadius:6 }} />
        <div>CAMPUS PRACTICO</div>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <div className="user-pill">{user.name}</div>
            <Link to="/dashboard" className="btn ghost" style={{ padding: "6px 10px" }}>Dashboard</Link>
            <Link to="/profile" className="btn ghost" style={{ padding: "6px 10px" }}>Perfil</Link>
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost">Login</Link>
            <Link to="/register" className="btn">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
}
