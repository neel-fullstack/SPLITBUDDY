// Header.js
import React, { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";

export default function Header({ user, searchValue, onSearchChange, onNewUser }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  React.useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("http://localhost:4000/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        // Optionally show error
      }
    }
    fetchNotifications();
    // Optionally poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  const handleClearNotifications = async () => {
    await fetch("http://localhost:4000/api/notifications", { method: "DELETE" });
    // Refresh notifications from backend after clearing
    try {
      const res = await fetch("http://localhost:4000/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
    }
  };

  return (
    <header
      style={{
        background: "#fff",
        padding: "0.8rem 2rem",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(78,84,200,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "72px",
      }}
    >
      {/* Logo */}
      <img
        src="/logo/finall.png"
        alt="Finall Logo"
        style={{
          height: "40px",
          width: "200px",
          marginRight: "2rem",
        }}
      />

      {/* Search */}
      <div
        style={{
          background: "#f5f6fa",
          display: "flex",
          alignItems: "center",
          borderRadius: "24px",
          padding: "0.4rem 1rem",
          width: "270px",
          boxShadow: "0 2px 8px rgba(143,148,251,0.08)",
        }}
      >
        <FaSearch style={{ color: "#4e54c8", marginRight: "0.7rem", fontSize: "1.1rem" }} />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
            background: "transparent",
            color: "#4e54c8",
            fontWeight: "500",
            fontFamily: "'Montserrat', sans-serif",
          }}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginLeft: "auto", position: "relative" }}>
        {/* Notifications */}
        <button
          style={{
            background: "#f5f6fa",
            border: "none",
            position: "relative",
            cursor: "pointer",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(143,148,251,0.10)",
          }}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FaBell style={{ color: "#4e54c8", fontSize: "1.3rem" }} />
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ff3b3b",
              color: "white",
              fontSize: "0.75rem",
              padding: "2px 6px",
              borderRadius: "50%",
              boxShadow: "0 1px 4px rgba(255,59,59,0.18)",
            }}
          >
            {notifications.length}
          </span>
        </button>
        {/* Notification Dropdown */}
        {showNotifications && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "80px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(78,84,200,0.15)",
              borderRadius: "12px",
              minWidth: "260px",
              zIndex: 2000,
              padding: "1rem",
            }}
          >
            <h6 style={{ margin: "0 0 0.5rem 0", color: "#185a9d" }}>Notifications</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {notifications.length === 0 ? (
                <li style={{ color: "#888", fontSize: "0.95rem" }}>No notifications</li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f5f6fa",
                      fontSize: "0.98rem",
                      color: "#333",
                    }}
                  >
                    {n.message}
                  </li>
                ))
              )}
            </ul>
            {notifications.length > 0 && (
              <button
                style={{
                  marginTop: "0.7rem",
                  background: "#185a9d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.3rem 1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={handleClearNotifications}
              >
                Clear All
              </button>
            )}
            {/* <button onClick={handleClearNotifications}>Clear Notifications</button> */}
          </div>
        )}

        {/* Profile + Logout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            background: "#f5f6fa",
            padding: "0.4rem 1rem",
            borderRadius: "24px",
            boxShadow: "0 2px 8px rgba(143,148,251,0.08)",
          }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              width: "36px",
              height: "36px",
            }}
            role="img"
            aria-label="profile"
          >
            👤
          </span>
          <span style={{
            color: "#4e54c8",
            fontWeight: "600",
            fontSize: "1rem",
            fontFamily: "'Montserrat', sans-serif",
          }}>
            {user?.name || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "#ff3b3b",
              border: "none",
              color: "white",
              padding: "4px 14px",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              boxShadow: "0 1px 4px rgba(143,148,251,0.18)",
              transition: "background 0.2s",
            }}
            onMouseOver={e => {
              e.target.style.background = "#c82333";
              e.target.style.boxShadow = "0 4px 16px rgba(200,35,51,0.18)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#ff3b3b";
              e.target.style.boxShadow = "0 1px 4px rgba(143,148,251,0.18)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
