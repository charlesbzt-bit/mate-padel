import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
    <div style={{ padding: 40, maxWidth: 520 }}>
      <h1>Mate</h1>
      <p>Padel à Paris — trouve 3 joueurs avant de réserver.</p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>{mode === "signup" ? "Créer un compte" : "Se connecter"}</strong>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "J’ai déjà un compte" : "Créer un compte"}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <label>
            Email
            <input
              style={{ width: "100%", padding: 10, marginTop: 6 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              style={{ width: "100%", padding: 10, marginTop: 6 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button disabled={busy} type="submit" style={{ padding: 10 }}>
            {busy ? "…" : mode === "signup" ? "Créer" : "Connexion"}
          </button>
        </form>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  );
}
