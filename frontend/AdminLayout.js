import React from "react";
import { Link } from "react-router-dom";
import {
  FaChartPie, FaUsers, FaUserCog, FaQuestionCircle,
  FaUsersCog, FaDownload, FaEdit, FaBell, FaSearch
} from "react-icons/fa";

export default function AdminLayout({ user, children }) {
  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
        background: "#f6f8fc",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "linear-gradient(180deg, #23243a 0%, #185a9d 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1rem 1rem 1rem",
          boxShadow: "2px 0 12px rgba(24,90,157,0.08)",
          position: "sticky",
          top: 0,
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/logo/finall.png"
            alt="SplitBuddy Logo"
            style={{
              width: "120px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(67,206,162,0.15)",
              marginBottom: "0.5rem",
            }}
          />
          <h4 style={{ fontWeight: "700", letterSpacing: "1px", margin: 0, color: "#fff" }}>
            ⚡ Admin Panel
          </h4>
        </div>
        <nav style={{ flex: 1 }}>
          <Link className="nav-link" style={navLinkStyle} to="/overview">
            <FaChartPie /> Overview
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/activeusers">
            <FaUsers /> Active Users
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/usermanagement">
            <FaUserCog /> User Management
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/queries">
            <FaQuestionCircle /> Queries
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/groupmonitoring">
            <FaUsersCog /> Group Monitoring
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/exportdata">
            <FaDownload /> Export Data
          </Link>
          <Link className="nav-link" style={navLinkStyle} to="/contentmanagement">
            <FaEdit /> Content Management
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            background: "linear-gradient(90deg, #2a2c55, #8f94fb)",
            padding: "0.8rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <h2 style={{ color: "white", margin: 0, fontWeight: "700", letterSpacing: "1px" }}>
              Admin Dashboard
            </h2>
          </div>
          {/* Search */}
          <div
            style={{
              background: "white",
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              padding: "0.3rem 0.8rem",
              width: "250px",
              boxShadow: "0 1px 6px rgba(24,90,157,0.07)",
            }}
          >
            <FaSearch style={{ color: "#aaa", marginRight: "0.5rem" }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "0.95rem",
                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                background: "transparent",
              }}
            />
          </div>
          {/* Notifications + Profile + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <FaBell style={{ color: "white", fontSize: "1.2rem" }} />
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  fontSize: "0.7rem",
                  padding: "2px 6px",
                  borderRadius: "50%",
                }}
              >
                5
              </span>
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(255,255,255,0.15)",
                padding: "0.3rem 0.6rem",
                borderRadius: "20px",
              }}
            >
              <img
                src={user?.profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
              <span style={{ color: "white", fontWeight: "500" }}>
                {user?.name || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main style={{ flex: 1, padding: "2rem", background: "#f6f8fc" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Sidebar link style
const navLinkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1.08rem",
  padding: "0.7rem 1rem",
  borderRadius: "8px",
  marginBottom: "0.3rem",
  transition: "background 0.2s, color 0.2s",
  cursor: "pointer",
};