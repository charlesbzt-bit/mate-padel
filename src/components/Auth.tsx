import { useState } from "react";
import type React from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Compte créé. Tu peux maintenant te connecter.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

    return (
    <div className="container">
      <div className="row space">
        <div>
          <div className="pill">🏸 Mate</div>
          <h1 className="h1" style={{ marginTop: 10 }}>Trouve 3 joueurs avant de réserver</h1>
          <div className="sub">Padel à Paris — rapide, simple, sans spam.</div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card cardPad" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="row space">
          <strong>{mode === "signup" ? "Créer un compte" : "Se connecter"}</strong>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "J’ai déjà un compte" : "Créer un compte"}
          </button>
        </div>

        <hr className="hr" />

        <form onSubmit={handleSubmit} className="grid">
          <div className="col-12">
            <label className="small muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="toi@email.com"
            />
          </div>

          <div className="col-12">
            <label className="small muted">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="col-12 row" style={{ justifyContent: "flex-end" }}>
            <button className="primary" disabled={busy} type="submit">
              {busy ? "…" : mode === "signup" ? "Créer" : "Connexion"}
            </button>
          </div>
        </form>

        {msg && (
          <div style={{ marginTop: 10 }} className="muted small">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
