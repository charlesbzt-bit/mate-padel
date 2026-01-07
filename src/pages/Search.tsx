import type { User } from "@supabase/supabase-js";
import Dashboard from "../components/Dashboard";

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

export default function Search(props: Props) {
  return <Dashboard {...props} />;
}
