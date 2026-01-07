import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

type Intention = {
  id: string;
  date: string;
  time_slot: string;
  zone: string;
  level: string;
};

type Props = {
  user: User;
  intentions: Intention[];

  onLogout: () => void;
  createIntention: () => Promise<void> | void;
  refresh: () => Promise<void> | void;

  date: string;
  setDate: (v: string) => void;
  timeSlot: string;
  setTimeSlot: (v: string) => void;
  zone: string;
  setZone: (v: string) => void;
  level: string;
  setLevel: (v: string) => void;
};

const labelSlot = (slot: string) => {
  if (slot === "morning") return "Matin";
  if (slot === "afternoon") return "Après-midi";
  if (slot === "evening") return "Soir";
  return slot;
};

const labelLevel = (lvl: string) => {
  if (lvl === "beginner") return "Débutant";
  if (lvl === "intermediate") return "Intermédiaire";
  if (lvl === "advanced") return "Avancé";
  return lvl;
};

export default function Dashboard({
  user,
  intentions,
  onLogout,
  createIntention,
  refresh,
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  zone,
  setZone,
  level,
  setLevel,
}: Props) {
  const list = Array.isArray(intentions) ? intentions : [];

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="brand">
          <div className="logo">🏓</div>
          <div>
            <h1 className="h1">Mate</h1>
            <div className="sub">Crée une intention de match et propose un créneau</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.email}</span>
          <button className="btn" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>

      <hr className="hr" />
      <div className="card pad" style={{ marginBottom: 16 }}>
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    <Link className="btn" to="/search">🔎 Rechercher</Link>
    <Link className="btn" to="/map">🗺️ Map</Link>
    <Link className="btn" to="/profile">👤 Profil</Link>
  </div>
</div>


      {/* CREATE */}
      <div className="card pad">
        <div className="sectionTitle">
          <h2>✨ Créer une intention</h2>
          <span className="badge">V1</span>
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          <div className="col-6">
            <label className="small muted">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="col-6">
            <label className="small muted">Créneau</label>
            <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
              <option value="evening">Soir</option>
            </select>
          </div>

          <div className="col-6">
            <label className="small muted">Zone</label>
            <input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Paris 15" />
          </div>

          <div className="col-6">
            <label className="small muted">Niveau</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn btnPrimary" onClick={createIntention}>🚀 Publier</button>
          <button className="btn" onClick={refresh}>Rafraîchir</button>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* LIST */}
      <div className="card pad">
        <div className="sectionTitle">
          <h2>📌 Intentions publiées</h2>
          <span className="badge">📋 Liste</span>
        </div>

        <div className="muted small" style={{ marginTop: 8 }}>
          V1 : tu vois les intentions. (Le “matching 4/4” arrive en V2.)
        </div>

        <hr className="hr" />

        {list.length === 0 ? (
          <div className="muted">Aucune intention pour l’instant. Crée la première 👆</div>
        ) : (
          list.map((m) => (
            <div key={m.id} className="card pad" style={{ marginBottom: 12 }}>
              <div className="sectionTitle">
                <h2>🗓️ {m.date} · {labelSlot(m.time_slot)}</h2>
                <span className="badge">🏓 Padel</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span className="badge">📍 <strong>{m.zone}</strong></span>
                <span className="badge">🎚️ <strong>{labelLevel(m.level)}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
