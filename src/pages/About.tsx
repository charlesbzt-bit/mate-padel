import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container">
      <div className="card pad">
        <h1 className="h1">À propos</h1>

        <p style={{ marginTop: 12 }}>
          Mate part d’un problème simple : organiser un match prend souvent plus de temps que jouer.
        </p>

        <p>
          L’objectif : proposer une intention claire (date, créneau, zone, niveau) visible par les
          autres joueurs.
        </p>

        <div style={{ marginTop: 18 }} className="sectionTitle">
          <h2>Roadmap</h2>
          <span className="badge">V2</span>
        </div>

        <ul style={{ marginTop: 10 }}>
          <li>Matching (rejoindre/quitter)</li>
          <li>Limite à 4 joueurs</li>
          <li>Filtres (zone / niveau / date)</li>
          <li>Partage d’une intention</li>
        </ul>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <Link to="/" className="btn">
            ← Retour
          </Link>
          <Link to="/login" className="btn btnPrimary">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
