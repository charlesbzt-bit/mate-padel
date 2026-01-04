import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container">
      <div className="card pad">
        <h1 className="h1">Mate 🏸</h1>
        <div className="sub">Propose une intention de match. Joue plus facilement.</div>

        <p style={{ marginTop: 14 }}>
          Mate te permet de publier un créneau (date, zone, niveau) pour organiser un match de padel
          sans prise de tête.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <Link to="/login" className="btn btnPrimary">
            Se connecter
          </Link>
          <Link to="/about" className="btn">
            À propos
          </Link>
          <Link to="/app" className="btn">
            Ouvrir l’app
          </Link>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="card pad">
        <div className="sectionTitle">
          <h2>✅ V1</h2>
          <span className="badge">Simple & stable</span>
        </div>
        <ul style={{ marginTop: 10 }}>
          <li>Créer une intention</li>
          <li>Consulter les intentions publiées</li>
          <li>Auth Supabase</li>
        </ul>
      </div>
    </div>
  );
}
