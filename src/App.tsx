import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Chargement…</div>;
  if (!session) return <Auth />;

  return <Dashboard user={session.user} onLogout={() => supabase.auth.signOut()} />;
}
