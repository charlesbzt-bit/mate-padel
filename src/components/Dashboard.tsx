export default function Dashboard({
  user,
  intentions,
  onLogout,
  createIntention,
  joinMatch,
  leaveMatch,
  refresh,
  labelLevel,
  labelSlot,
}: any) {
  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="brand">
          <div className="logo">🏸</div>
          <div>
            <h1 className="h1">Mate</h1>
            <div className="sub">Padel à Paris — matching avant réservation</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge">{user.email}</span>
          <button className="btn" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>

      <hr className="hr" />

      {/* CREATE */}
      <div className="card pad">
        <div className="sectionTitle">
          <h2>✨ Créer une intention</h2>
          <span className="badge">⚡ Rapide</span>
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          <div className="col-6">
            <label>Date</label>
            <input type="date" />
          </div>
          <div className="col-6">
            <label>Créneau</label>
            <select>
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
              <option value="evening">Soir</option>
            </select>
          </div>
          <div className="col-6">
            <label>Zone</label>
            <input placeholder="Paris 15" />
          </div>
          <div className="col-6">
            <label>Niveau</label>
            <select>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn btnPrimary" onClick={createIntention}>🚀 Publier</button>
          <button className="btn" onClick={refresh}>Rafraîchir</button>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* LIST */}
      <div className="card pad">
        <div className="sectionTitle">
          <h2>📅 Intentions à venir</h2>
          <span className="badge">🤝 Matching</span>
        </div>

        <hr className="hr" />

        {intentions.map((m: any) => {
          const c = m.count || 0;
          const isFull = c >= 4;

          return (
            <div key={m.id} className="card pad" style={{ marginBottom: 12 }}>
              <div className="sectionTitle">
                <h2>🗓️ {m.date} · {labelSlot(m.time_slot)}</h2>
                <span className="badge">🏓 Padel</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span className={`badge ${isFull ? "full" : c >= 2 ? "ok" : "warn"}`}>
                  👥 {Math.min(c, 4)}/4 {isFull ? "Complet" : "joueurs"}
                </span>
                <span className="badge">📍 {m.zone}</span>
                <span className="badge">🎚️ {labelLevel(m.level)}</span>
              </div>

              <div className="progress">
                <div style={{ width: `${Math.min(100, (c / 4) * 100)}%` }} />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {!isFull && (
                  <button className="btn btnSuccess" onClick={() => joinMatch(m.id)}>
                    ➕ Rejoindre
                  </button>
                )}
                <button className="btn btnDanger" onClick={() => leaveMatch(m.id)}>
                  Quitter
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
