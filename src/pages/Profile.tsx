import type { User } from "@supabase/supabase-js";

export default function Profile({ user }: { user: User }) {
  return (
    <div className="container">
      <h1>👤 Profil</h1>
      <p>Email : {user.email}</p>
      <p>(Historique et stats arriveront plus tard)</p>
    </div>
  );
}
