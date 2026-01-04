import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

type Intention = {
  id: string;
  date: string;
  time_slot: string;
  zone: string;
  level: string;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const user: User | null = session?.user ?? null;

  const [loading, setLoading] = useState(true);

  // form
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState<string>("evening");
  const [zone, setZone] = useState<string>("Paris 15");
  const [level, setLevel] = useState<string>("beginner");

  // data
  const [intentions, setIntentions] = useState<Intention[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function onLogout() {
    await supabase.auth.signOut();
  }

  async function refresh() {
    if (!user) return;

    const { data, error } = await supabase
      .from("match_intentions")
      .select("id, date, time_slot, zone, level")
      .order("date", { ascending: true });

    if (error) {
      console.error(error);
      setIntentions([]);
      return;
    }

    setIntentions((data as Intention[]) ?? []);
  }

  useEffect(() => {
    if (!user) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function createIntention() {
    if (!user) return;

    const { error } = await supabase.from("match_intentions").insert({
      user_id: user.id,
      date,
      time_slot: timeSlot,
      zone,
      level,
    });

    if (error) console.error(error);
    await refresh();
  }

  if (loading) return null;
  if (!user) return <Auth />;

  return (
    <Dashboard
      user={user}
      onLogout={onLogout}
      createIntention={createIntention}
      refresh={refresh}
      date={date}
      setDate={setDate}
      timeSlot={timeSlot}
      setTimeSlot={setTimeSlot}
      zone={zone}
      setZone={setZone}
      level={level}
      setLevel={setLevel}
      intentions={intentions}
    />
  );
}
