// src/User/UserHeader.js
import { Link, useNavigate } from "react-router-dom";

export default function UserHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  function handleLogout() {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg px-3"
        style={{
          background: "#ffffffff",
          boxShadow: "0 50px 30px rgba(24, 90, 157, 0.18), 0 1.5px 0 #185b9d10",
        }}
      >
        <div className="container-fluid">
          {/* Logo on left */}
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <img
              src="/logo/finall.png"
              alt="Logo"
              style={{
                height: "50px",
                marginRight: "5px",
                
              }}
            />
            <span
              style={{
                color: "#7a7171ff",
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ border: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Centered navigation */}
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav">
                {[
                  { to: "/home", label: "Home" },
                  { to: "/groups", label: "Groups" },
                  { to: "/balances", label: "Balances" },
                
                  { to: "/contactus", label: "Contact Us" }, // <-- New link added
                    { to: "/settings", label: "Settings" },
                ].map((item, idx) => (
                  <li key={idx} className="nav-item">
                    <Link
                      className="nav-link"
                      to={item.to}
                      style={{
                        color: window.location.pathname === item.to ? "#fff" : "#185a9d",
                        background: window.location.pathname === item.to ? "#185a9d" : "transparent",
                        fontWeight: 600,
                        fontSize: "1rem",
                        marginRight: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "12px",
                        borderBottom: "2px solid transparent",
                        textDecoration: "none",
                        transition: "background 0.2s, color 0.2s",
                        fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = "#185a9d";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = window.location.pathname === item.to ? "#185a9d" : "transparent";
                        e.currentTarget.style.color = window.location.pathname === item.to ? "#fff" : "#185a9d";
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* Right end: Welcome + Logout */}
          <div className="d-flex align-items-center ms-auto">
            <span
              className="me-3"
              style={{ fontWeight: 600, color: "#185a9d" }}
            >
              Welcome, {user?.name || "User"}
            </span>
            <button
              className="btn btn-sm"
              style={{
                borderRadius: "20px",
                border: "1px solid #185a9d",
                color: "#fff",
                fontWeight: 500,
                padding: "4px 12px",
                background: "#185a9d",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1565c0"; // slightly darker blue
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#1565c0";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#185a9d";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#185a9d";
              }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      {/* { <footer
        className="text-center py-3 mt-auto"
        style={{
          background: "#5BC5A7",
          color: "#fff",
          borderTop: "3px solid #005bbb",
          fontWeight: 500,
          letterSpacing: "1px",
        }}
      >
        © {new Date().getFullYear()} SplitBuddy. All rights reserved.
      </footer> } */}
    </>
  );
}
