import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type MatchIntention = {
  id: string;
  creator_id: string;
  date: string;
  time_slot: "morning" | "afternoon" | "evening";
  zone: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "open" | "full" | "cancelled";
  created_at: string;
};

type Club = {
  id: string;
  name: string;
  zone: string;
  booking_url: string;
};

type Props = { user: any; onLogout: () => void };

function labelLevel(l: string) {
  return l === "beginner" ? "Débutant" : l === "intermediate" ? "Intermédiaire" : "Avancé";
}
function labelSlot(s: string) {
  return s === "morning" ? "Matin" : s === "afternoon" ? "Après-midi" : "Soir";
}

export default function Dashboard({ user, onLogout }: Props) {
  const [intentions, setIntentions] = useState<MatchIntention[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [zone, setZone] = useState("Paris 15");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening">("evening");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const { data: clubsData, error: clubsErr } = await supabase.from("clubs").select("*");
      if (clubsErr) throw clubsErr;
      setClubs(clubsData ?? []);

      const { data: intentionsData, error: iErr } = await supabase
        .from("match_intentions")
        .select("*")
        .neq("status", "cancelled")
        .order("date", { ascending: true })
        .limit(100);
      if (iErr) throw iErr;
      setIntentions(intentionsData ?? []);

      const ids = (intentionsData ?? []).map((m) => m.id);
      if (ids.length) {
        const { data: playersData, error: pErr } = await supabase
          .from("match_players")
          .select("match_id,user_id")
          .in("match_id", ids);
        if (pErr) throw pErr;

        const nextCounts: Record<string, number> = {};
        const nextJoined: Record<string, boolean> = {};

        for (const row of playersData ?? []) {
          nextCounts[row.match_id] = (nextCounts[row.match_id] ?? 0) + 1;
          if (row.user_id === user.id) nextJoined[row.match_id] = true;
        }
        setCounts(nextCounts);
        setJoined(nextJoined);
      } else {
        setCounts({});
        setJoined({});
      }
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = useMemo(() => intentions.filter((m) => m.status !== "cancelled"), [intentions]);

  function proposedClubsFor(match: MatchIntention): Club[] {
    const zoneMatches = clubs.filter((c) => c.zone.toLowerCase() === match.zone.toLowerCase());
    const pool = zoneMatches.length ? zoneMatches : clubs;
    return pool.slice(0, 5);
  }

  async function createIntention() {
    setError(null);
    try {
      const { error: insErr } = await supabase.from("match_intentions").insert({
        creator_id: user.id,
        date,
        time_slot: timeSlot,
        zone,
        level,
        status: "open",
      });
      if (insErr) throw insErr;
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    }
  }

  async function joinMatch(matchId: string) {
    setError(null);
    try {
      const c = counts[matchId] ?? 0;
      if (c >= 4) return;

      const { error: jErr } = await supabase.from("match_players").insert({
        match_id: matchId,
        user_id: user.id,
      });
      if (jErr) throw jErr;

      await refresh();

      // best-effort: if full, mark full
      const newCount = (counts[matchId] ?? 0) + 1;
      if (newCount >= 4) {
        await supabase.from("match_intentions").update({ status: "full" }).eq("id", matchId);
        await refresh();
      }
    } catch (e: any) {
      setError(e?.message ?? "Erreur (déjà inscrit ?)");
      await refresh();
    }
  }

  async function leaveMatch(matchId: string) {
    setError(null);
    try {
      const { error: dErr } = await supabase
        .from("match_players")
        .delete()
        .eq("match_id", matchId)
        .eq("user_id", user.id);
      if (dErr) throw dErr;

      await refresh();

      const newCount = Math.max(0, (counts[matchId] ?? 0) - 1);
      if (newCount < 4) {
        await supabase.from("match_intentions").update({ status: "open" }).eq("id", matchId);
        await refresh();
      }
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Mate</h1>
          <div style={{ opacity: 0.8 }}>Padel à Paris — matching avant réservation</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 999 }}>{user.email}</span>
          <button onClick={onLogout}>Déconnexion</button>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <strong>Créer une intention</strong>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <label style={{ minWidth: 180 }}>
            Date
            <input style={{ width: "100%", padding: 10, marginTop: 6 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label style={{ minWidth: 180 }}>
            Créneau
            <select style={{ width: "100%", padding: 10, marginTop: 6 }} value={timeSlot} onChange={(e) => setTimeSlot(e.target.value as any)}>
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
              <option value="evening">Soir</option>
            </select>
          </label>

          <label style={{ minWidth: 220, flex: 1 }}>
            Zone (ex: Paris 15)
            <input style={{ width: "100%", padding: 10, marginTop: 6 }} value={zone} onChange={(e) => setZone(e.target.value)} />
          </label>

          <label style={{ minWidth: 200 }}>
            Niveau
            <select style={{ width: "100%", padding: 10, marginTop: 6 }} value={level} onChange={(e) => setLevel(e.target.value as any)}>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button onClick={createIntention}>Publier</button>
          <button onClick={refresh}>Rafraîchir</button>
        </div>

        {error && <p style={{ marginTop: 10 }}>⚠️ {error}</p>}
      </div>

      <div style={{ height: 16 }} />

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <strong>Intentions à venir</strong>
        <p style={{ opacity: 0.8, marginTop: 6 }}>Objectif : compléter à 4 joueurs, puis choisir un club et réserver.</p>

        <hr />

        {loading ? (
          <div>Chargement…</div>
        ) : list.length === 0 ? (
          <div>Aucune intention pour l’instant. Crée la première.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {list.map((m) => {
              const c = counts[m.id] ?? 0;
              const isFull = c >= 4 || m.status === "full";
              const isJoined = !!joined[m.id];

              return (
                <div key={m.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #ddd" }}>{m.zone}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #ddd" }}>{labelLevel(m.level)}</span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div>
                      <b>{m.date}</b> · {labelSlot(m.time_slot)}
                    </div>
                    <div style={{ opacity: 0.85 }}>
                      Joueurs : <b>{Math.min(c, 4)}/4</b> {isFull ? "✅" : ""}
                    </div>
                  </div>

                  <hr style={{ margin: "12px 0" }} />

                  {!isJoined ? (
                    <button disabled={isFull} onClick={() => joinMatch(m.id)}>
                      {isFull ? "Complet" : "Rejoindre"}
                    </button>
                  ) : (
                    <button onClick={() => leaveMatch(m.id)}>Quitter</button>
                  )}

                  {isFull && (
                    <>
                      <hr style={{ margin: "12px 0" }} />
                      <div style={{ opacity: 0.9 }}>
                        <b>Clubs proposés</b> (réservation externe)
                      </div>
                      <ul style={{ marginTop: 8 }}>
                        {proposedClubsFor(m).map((club) => (
                          <li key={club.id}>
                            {club.name} —{" "}
                            <a href={club.booking_url} target="_blank" rel="noreferrer">
                              Réserver
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
