import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Completá ambos campos");
      return;
    }
    setLoading(true);
    setTimeout(() => { // pequeña simulación
      const users = JSON.parse(localStorage.getItem("classroom_users") || "[]");
      const found = users.find(u => u.email === form.email && u.password === form.password);
      setLoading(false);
      if (!found) {
        setError("Email o contraseña incorrectos");
        return;
      }
      setUser({ id: found.id, name: found.name, email: found.email });
      navigate("/dashboard");
    }, 350);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Bienvenido de nuevo</h2>
        <p className="auth-sub">Ingresá con tu cuenta para continuar</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form" autoComplete="off">
          <div className="form-row">
            <label className="field-label">Email</label>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="tu@correo.com"
              autoComplete="username"
            />
          </div>

          <div className="form-row">
            <label className="field-label">Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label="Mostrar contraseña"
                className="toggle-password"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
            <Link className="btn btn-ghost" to="/register">Crear cuenta</Link>
          </div>
        </form>

        <div className="auth-footer muted" style={{ marginTop: 12 }}>
          ¿Olvidaste tu contraseña? 
        </div>
      </div>
    </div>
  );
}
