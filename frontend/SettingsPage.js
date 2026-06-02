import React, { useState } from "react";
import { api } from "../api";

export default function SettingsPage() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    try {
      const updated = await api.updateUser(user.user_id, { name, email });
      sessionStorage.setItem("loggedInUser", JSON.stringify(updated));
      setMsg("Profile updated ✅");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div>
      <h2>User Settings</h2>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email:
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
