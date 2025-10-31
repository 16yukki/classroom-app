import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

/*
 Structure for a class object (stored in classes array):
 {
   id,
   name,
   subject,
   description,
   students: [{id, name}],
   tasks: [{id, title, desc, due, status, studentId?}],
   grades: { studentId: [ {taskId, grade} ] },
   records: [{id, title, text, date}]
 }
*/

export default function Dashboard() {
  const { classes, setClasses, user } = useContext(AppContext);
  const [showNew, setShowNew] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", subject: "", description: "" });
  const [selectedClassId, setSelectedClassId] = useState(null);

  // create class
  const createClass = (e) => {
    e.preventDefault();
    if (!newClass.name) return;
    const c = {
      id: Date.now(),
      name: newClass.name,
      subject: newClass.subject,
      description: newClass.description,
      students: [],
      tasks: [],
      grades: {},
      records: []
    };
    setClasses([c, ...classes]);
    setNewClass({ name: "", subject: "", description: "" });
    setShowNew(false);
  };

  // add student to class
  const addStudent = (classId, studentName) => {
    if (!studentName) return;
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      const sid = Date.now();
      return { ...c, students: [...c.students, { id: sid, name: studentName }] };
    }));
  };

  // create task
  const addTask = (classId, task) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, tasks: [{ id: Date.now(), ...task, status: "pendiente" }, ...c.tasks] };
    }));
  };

  // mark task delivered / toggle status
  const toggleTaskStatus = (classId, taskId) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, status: t.status === "pendiente" ? "entregada" : "pendiente" } : t) };
    }));
  };

  // add grade
  const addGrade = (classId, studentId, value) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      const grades = { ...c.grades };
      if (!grades[studentId]) grades[studentId] = [];
      grades[studentId].push({ id: Date.now(), value: Number(value) });
      return { ...c, grades };
    }));
  };

  // add record (acta)
  const addRecord = (classId, title, text) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, records: [{ id: Date.now(), title, text, date: new Date().toISOString() }, ...c.records] };
    }));
  };

  // UI helpers
  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div className="dashboard-container">
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar card">
            <h3>Tus clases</h3>

            <div style={{ margin: "10px 0" }}>
              <button className="btn" onClick={() => setShowNew(s => !s)}>{showNew ? "Cerrar" : "Crear clase"}</button>
            </div>

            {showNew && (
              <form className="card form" onSubmit={createClass} style={{ marginBottom: 12 }}>
                <label>Nombre</label>
                <input value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} />
                <label>Materia</label>
                <input value={newClass.subject} onChange={e => setNewClass({...newClass, subject: e.target.value})} />
                <label>Descripción</label>
                <textarea value={newClass.description} onChange={e => setNewClass({...newClass, description: e.target.value})} />
                <button className="btn" type="submit">Crear</button>
              </form>
            )}

            <div className="compact-list" style={{ marginTop: 8 }}>
              {classes.length === 0 && <div className="muted">No tenés clases aún.</div>}
              {classes.map(c => (
                <div key={c.id} className="item" onClick={() => setSelectedClassId(c.id)} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <strong>{c.name}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>{c.subject}</div>
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>{c.students.length}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN PANEL */}
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <h2>Bienvenido{user ? `, ${user.name}` : ""}</h2>
                <div className="muted">Resumen rápido de tus clases</div>
              </div>
              <div>
                {/* botón duplicado para crear desde main (opcional) */}
                <button className="btn ghost" onClick={() => setShowNew(s => !s)}>{showNew ? "Cerrar" : "Crear clase"}</button>
              </div>
            </div>

            {/* cards grid con resumen */}
            <div className="cards-grid">
              {classes.map(c => (
                <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3>{c.name}</h3>
                    <p className="muted">{c.subject}</p>
                    <p className="small" style={{ marginTop: 8 }}>{c.description}</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn tiny" onClick={() => setSelectedClassId(c.id)}>Abrir</button>
                      <button className="btn tiny" onClick={() => {
                        if (confirm("Eliminar clase?")) {
                          setClasses(prev => prev.filter(x => x.id !== c.id));
                          if (selectedClassId === c.id) setSelectedClassId(null);
                        }
                      }}>Eliminar</button>
                    </div>
                    <div className="muted small">{c.students.length} alumnos</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <h3>Detalle de la clase</h3>
              {selectedClass ? (
                <div>
                  <h4>{selectedClass.name} <span className="muted" style={{ fontSize: 14 }}>({selectedClass.subject})</span></h4>
                  <p className="muted">{selectedClass.description}</p>

                  <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

                  {/* Students */}
                  <section style={{ marginBottom: 12 }}>
                    <h4>Alumnos</h4>
                    <StudentsManager classObj={selectedClass} addStudent={addStudent} />
                  </section>

                  {/* Tasks */}
                  <section style={{ marginBottom: 12 }}>
                    <h4>Tareas</h4>
                    <TaskManager classObj={selectedClass} addTask={addTask} toggleTaskStatus={toggleTaskStatus} />
                  </section>

                  {/* Grades */}
                  <section style={{ marginBottom: 12 }}>
                    <h4>Notas</h4>
                    <GradesManager classObj={selectedClass} addGrade={addGrade} />
                  </section>

                  {/* Records */}
                  <section style={{ marginBottom: 12 }}>
                    <h4>Actas</h4>
                    <RecordsManager classObj={selectedClass} addRecord={addRecord} />
                  </section>
                </div>
              ) : (
                <div className="muted">Seleccioná una clase desde la izquierda o desde las tarjetas para ver el detalle.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* Subcomponents used inside Dashboard (kept in same file for simplicidad) */

function StudentsManager({ classObj, addStudent }) {
  const [name, setName] = useState("");
  return (
    <div>
      <div className="small-form" style={{ marginBottom: 8 }}>
        <input placeholder="Nombre del alumno" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn tiny" onClick={() => { addStudent(classObj.id, name); setName(""); }}>Agregar</button>
      </div>
      <ul>
        {classObj.students.length === 0 && <li className="muted">Sin alumnos</li>}
        {classObj.students.map(s => <li key={s.id}>{s.name}</li>)}
      </ul>
    </div>
  );
}

function TaskManager({ classObj, addTask, toggleTaskStatus }) {
  const [task, setTask] = useState({ title: "", desc: "", due: "" });

  return (
    <div>
      <div className="small-form" style={{ marginBottom: 8 }}>
        <input placeholder="Título" value={task.title} onChange={e => setTask({...task, title: e.target.value})} />
        <input placeholder="Fecha entrega (YYYY-MM-DD)" value={task.due} onChange={e => setTask({...task, due: e.target.value})} />
        <button className="btn tiny" onClick={() => { addTask(classObj.id, task); setTask({title:"",desc:"",due:""}); }}>Crear tarea</button>
      </div>

      <ul>
        {classObj.tasks.length === 0 && <li className="muted">Sin tareas</li>}
        {classObj.tasks.map(t => (
          <li key={t.id} className="task-line">
            <div>
              <strong>{t.title}</strong> <span className="muted small">({t.due || "sin fecha"})</span>
              <div className="small">{t.desc}</div>
            </div>
            <div>
              <button className="btn tiny" onClick={() => toggleTaskStatus(classObj.id, t.id)}>{t.status === "pendiente" ? "Marcar entregada" : "Marcar pendiente"}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GradesManager({ classObj, addGrade }) {
  const [selected, setSelected] = useState("");
  const [value, setValue] = useState("");

  // calculate average helper
  const average = (gradesArr = []) => {
    if (!gradesArr.length) return "-";
    const s = gradesArr.reduce((a,b)=>a+b.value,0);
    return (s / gradesArr.length).toFixed(2);
  };

  return (
    <div>
      <div className="small-form" style={{ marginBottom: 8 }}>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Seleccioná alumno</option>
          {classObj.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input placeholder="Nota (número)" value={value} onChange={e => setValue(e.target.value)} />
        <button className="btn tiny" onClick={() => { if(selected && value) { addGrade(classObj.id, selected, value); setValue(""); } }}>Agregar nota</button>
      </div>

      <ul>
        {classObj.students.length === 0 && <li className="muted">No hay alumnos</li>}
        {classObj.students.map(s => (
          <li key={s.id}>
            <strong>{s.name}</strong> - Promedio: {average(classObj.grades[s.id] || [])}
            <div className="muted small">
              { (classObj.grades[s.id] || []).map(g => <span key={g.id}>[{g.value}] </span>)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecordsManager({ classObj, addRecord }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  return (
    <div>
      <div className="small-form" style={{ marginBottom: 8 }}>
        <input placeholder="Título acta" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="btn tiny" onClick={() => { addRecord(classObj.id, title || "Acta", text); setTitle(""); setText(""); }}>Agregar acta</button>
      </div>
      <ul>
        {classObj.records.length === 0 && <li className="muted">Sin actas</li>}
        {classObj.records.map(r => (
          <li key={r.id}>
            <strong>{r.title}</strong> <div className="muted small">{new Date(r.date).toLocaleString()}</div>
            <div>{r.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
