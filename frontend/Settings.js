// src/User/Settings.js
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const u = sessionStorage.getItem("loggedInUser");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setForm({ name: parsed.name, email: parsed.email, password: "" });
    }
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:4000/api/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();

      sessionStorage.setItem("loggedInUser", JSON.stringify(updated));
      setUser(updated);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile.");
    }
  }

  if (!user) return <p className="p-3">Loading...</p>;

  return (
    <>
      <UserHeader />
     
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px",
          background: "#f4f7fb",
          minHeight: "83.5vh",
          fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
        }}
        className="bg-light"
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "40px 48px",
            boxShadow: "0 50px 100px #185a9d",
            width: "100%",
            maxWidth: "800px",
            fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
          }}
          className="shadow-lg"
        >
          <h2
            className="mb-4 text-center fw-bold"
            style={{ color: "#185a9d", fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
          >
            ⚙️ Settings
          </h2>

          {message && (
            <div className="alert alert-info text-center" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>{message}</div>
          )}

          <form onSubmit={handleSave} style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#185a9d' }}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your name"
                style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#185a9d' }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
                style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#185a9d' }}>New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Leave blank to keep current password"
                style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn fw-semibold"
                style={{
                  backgroundColor: '#185a9d',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#1565c0';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#185a9d';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
     
      <Outlet />
        <UserFooter />
    </>
  );
}
