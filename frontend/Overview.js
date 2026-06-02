import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Overview() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const [stats, setStats] = useState({
    users: 0,
    groups: 0,
    queries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = () => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:4000/api/overview/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch stats. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Bar chart data
  const barData = {
    labels: ["Users", "Groups", "Queries"],
    datasets: [
      {
        label: "Overview Stats",
        data: [stats.users, stats.groups, stats.queries],
        backgroundColor: ["#185a9d", "#43cea2", "#ff3b3b"],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Poppins" } },
      },
      y: {
        grid: { color: "#eee" },
        beginAtZero: true,
        ticks: { font: { family: "Poppins" } },
      },
    },
  };

  return (
    <div
      className="container-fluid vh-100 p-0"
      style={{
        background: "#f5f6fa",
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <Header user={user} />

      {/* Sidebar + Main Content */}
      <div className="row h-100 m-0" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main content */}
        <div
          className="col-md-9 col-lg-10 p-4"
          style={{
            background: "#f5f6fa",
            minHeight: "100vh",
          }}
        >
          {/* Quick Stats */}
          <div
            className="row mb-4"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
           
          </div>
          {error && (
            <div className="alert alert-danger" style={{ borderRadius: "1rem" }}>
              {error}
            </div>
          )}
          <div
            className="row mb-4"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {["Total Users", "Active Groups", "Pending Queries"].map((label, idx) => (
              <div
                key={label}
                style={{
                  flex: "1",
                  minWidth: "220px",
                  maxWidth: "32%",
                }}
              >
                <div
                  className="card shadow-sm p-3"
                  style={{
                    borderRadius: "1.2rem",
                    background: "#fff",
                    border: "none",
                    boxShadow: "0 2px 12px rgba(24,90,157,0.07)",
                    fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                    textAlign: "center",
                  }}
                >
                  <h5 style={{ color: "#185a9d", fontWeight: "600" }}>{label}</h5>
                  <p
                    className="fs-4 fw-bold"
                    style={{
                      color: "#222",
                      fontSize: "2rem",
                      margin: "0.5rem 0 0 0",
                      fontWeight: "700",
                      transition: "color 0.3s, transform 0.3s",
                      transform: loading ? "scale(1.1)" : "scale(1)",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    {loading
                      ? <span className="spinner-border spinner-border-sm" />
                      : [stats.users, stats.groups, stats.queries][idx]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart Feature */}
          <div
            className="card shadow-sm p-4 mb-4"
            style={{
              borderRadius: "1.2rem",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 12px rgba(24,90,157,0.07)",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              maxWidth: "1500px",
              margin: "0",
            }}
          >
            <h5 style={{ color: "#185a9d", fontWeight: "600", marginBottom: "1rem" }}>
              Overview Bar Chart
            </h5>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <span className="spinner-border" />
              </div>
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>
 <button
              className="btn btn-outline-primary mb-3"
              style={{
                borderRadius: "1rem",
                fontWeight: "500",
                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                alignSelf: "flex-end",
                marginLeft: "auto",
                marginRight: "0",
                minWidth: "1220px",
              }}
              onClick={fetchStats}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          {/* Placeholder for Child Pages */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
