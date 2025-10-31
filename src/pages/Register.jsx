import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password } = form;
    if (!name || !email || !password) {
      setError("Completá todos los campos");
      return;
    }
    const users = JSON.parse(localStorage.getItem("classroom_users") || "[]");
    if (users.find(u => u.email === email)) {
      setError("El email ya está registrado");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem("classroom_users", JSON.stringify(users));
      setLoading(false);
      // auto-login: guardamos user activo
      localStorage.setItem("classroom_user", JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
      navigate("/login");
    }, 450);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-sub">Registrate</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form" autoComplete="off">
          <div className="form-row">
            <label className="field-label">Nombre completo</label>
            <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Tu nombre" />
          </div>

          <div className="form-row">
            <label className="field-label">Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} placeholder="tu@correo.com" />
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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creando..." : "Registrarme"}
            </button>
            <Link className="btn btn-ghost" to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
