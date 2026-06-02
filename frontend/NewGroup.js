// src/User/NewGroup.js
import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";

const BASE = "http://localhost:4000";

export default function NewGroup() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  const [groupName, setGroupName] = useState("");
  const [msg, setMsg] = useState(null);

  async function createGroup(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: groupName,
          created_by: user?.user_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create group");
      setGroupName("");
      setMsg("✅ Group created successfully!");
    } catch (err) {
      console.error("Group create error:", err);
      setMsg("❌ Error creating group");
    }
  }

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
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <h2
            className="mb-4 text-center"
            style={{ color: "#0077ff", fontWeight: "bold" }}
          >
            ➕ Create New Group
          </h2>

          <form onSubmit={createGroup}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold">Group Name</label>
              <input
                className="form-control"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  background: "linear-gradient(90deg, #0077ff, #00c6ff)",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                Create Group
              </button>
            </div>
          </form>

          {msg && (
            <div className="alert alert-info text-center mt-3">{msg}</div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
