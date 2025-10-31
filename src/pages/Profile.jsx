import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

export default function Profile() {
  const { user, setUser } = useContext(AppContext);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { setName(user?.name || ""); }, [user]);

  const save = () => {
    setMsg("");
    if (!name.trim()) {
      setMsg("El nombre no puede quedar vacío");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = { ...user, name: name.trim() };
      setUser(updated);
      // update stored users list (persistir cambio)
      const users = JSON.parse(localStorage.getItem("classroom_users") || "[]");
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) {
        users[idx].name = updated.name;
        localStorage.setItem("classroom_users", JSON.stringify(users));
      }
      localStorage.setItem("classroom_user", JSON.stringify(updated));
      setLoading(false);
      setMsg("Perfil actualizado");
      setTimeout(() => setMsg(""), 2200);
    }, 400);
  };

  const initials = (nameStr = "") => {
    const parts = nameStr.trim().split(" ").filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ paddingTop: 18 }}>
        <div className="profile-grid">
          <section className="card" style={{ maxWidth: 380 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="avatar">{initials(name || user?.name)}</div>
              <div>
                <h3 style={{ margin: 0 }}>{user?.name}</h3>
                <div className="muted" style={{ fontSize: 13 }}>{user?.email}</div>
              </div>
            </div>

            <hr style={{ margin: "14px 0" }} />

            <label className="field-label">Nombre</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />

            <label className="field-label">Email</label>
            <input className="input" value={user?.email || ""} disabled />

            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={save} disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="btn btn-ghost" onClick={() => { setName(user?.name || ""); setMsg(""); }}>Cancelar</button>
            </div>

            {msg && <div style={{ marginTop: 10 }} className={msg.includes("actualizado") ? "success" : "error"}>{msg}</div>}
          </section>

          <section className="card" style={{ flex: 1 }}>
            <h3>Seguridad</h3>
            <p className="muted">las contraseñas se guardan en localStorage (texto plano)</p>

            <hr style={{ margin: "12px 0" }} />

            <h4>Cambiar contraseña</h4>
            <ChangePassword email={user?.email} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Componente interno para cambiar contraseña (actualiza classroom_users) */
function ChangePassword({ email }) {
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [msg, setMsg] = useState("");

  const handle = (e) => {
    e.preventDefault();
    setMsg("");
    const users = JSON.parse(localStorage.getItem("classroom_users") || "[]");
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) { setMsg("Usuario no encontrado"); return; }
    if (users[idx].password !== oldP) { setMsg("Contraseña actual incorrecta"); return; }
    if (newP.length < 4) { setMsg("La nueva debe tener al menos 4 caracteres"); return; }
    users[idx].password = newP;
    localStorage.setItem("classroom_users", JSON.stringify(users));
    setOldP(""); setNewP("");
    setMsg("Contraseña actualizada");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <form onSubmit={handle} style={{ marginTop: 8 }}>
      <label className="field-label">Contraseña actual</label>
      <input className="input" type="password" value={oldP} onChange={e => setOldP(e.target.value)} />

      <label className="field-label">Nueva contraseña</label>
      <input className="input" type="password" value={newP} onChange={e => setNewP(e.target.value)} />

      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" type="submit">Cambiar contraseña</button>
      </div>

      {msg && <div style={{ marginTop: 8 }} className={msg.includes("actualizada") ? "success" : "error"}>{msg}</div>}
    </form>
  );
}
