import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartPie, FaUserCog, FaQuestionCircle, FaUsersCog } from "react-icons/fa";

const navLinks = [
  { to: "/overview", icon: <FaChartPie />, label: "Overview" },
  //{ to: "/activeusers", icon: <FaUsers />, label: "Active Users" },
  { to: "/groupmonitoring", icon: <FaUsersCog />, label: "Group Monitoring" },
  { to: "/usermanagement", icon: <FaUserCog />, label: "User Management" },
  { to: "/query", icon: <FaQuestionCircle />, label: "Queries" },
  
  // { to: "/exportdata", icon: <FaDownload />, label: "Export Data" },
  // { to: "/contentmanagement", icon: <FaEdit />, label: "Content Management" },
];

export default function Sidebar({ user }) {
  const location = useLocation();

  return (
    <aside
      style={{
        background: "#fff",
        color: "#222",
        minHeight: "100vh",
        boxShadow: "0 2px 8px rgba(78,84,200,0.08)",
        padding: "2rem 1rem 1rem 1rem",
        width: "250px",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navLinks.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="nav-link"
            style={{
              color: location.pathname === to ? "#fff" : "#185a9d",
              background: location.pathname === to ? "#185a9d" : "transparent",
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              padding: "0.7rem 1rem",
              borderRadius: "12px",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
            }}
            onMouseOver={e => {
              e.target.style.background = "#185a9d";
              e.target.style.color = "#fff";
            }}
            onMouseOut={e => {
              e.target.style.background = location.pathname === to ? "#185a9d" : "transparent";
              e.target.style.color = location.pathname === to ? "#fff" : "#185a9d";
            }}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
