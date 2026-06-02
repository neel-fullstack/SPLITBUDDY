import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInfo("Registration successful. Please login.");
        setTimeout(() => navigate("/login", { replace: true }), 700);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#ffffffff",
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2rem 1.5rem",
          background: "#fff",
          transition: "box-shadow 0.3s",
          fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo/finall.png"
            alt="SplitBuddy Logo"
            style={{
              width: "250px",
              marginBottom: "18px",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(67,206,162,0.15)",
            }}
          />
          <h4
            className="fw-bold"
            style={{
              color: "#185a9d",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
            }}
          >
            Create Your Account
          </h4>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {info && <div className="alert alert-success py-2">{info}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = "#185a9d")}
              onBlur={(e) => (e.target.style.borderColor = "#000000ff")}
              onMouseOver={(e) => (e.target.style.borderColor = "#185a9d")}
              onMouseOut={(e) => (e.target.style.borderColor = "#000000ff")}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = "#185a9d")}
              onBlur={(e) => (e.target.style.borderColor = "#000000ff")}
              onMouseOver={(e) => (e.target.style.borderColor = "#185a9d")}
              onMouseOut={(e) => (e.target.style.borderColor = "#000000ff")}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = "#185a9d")}
              onBlur={(e) => (e.target.style.borderColor = "#000000ff")}
              onMouseOver={(e) => (e.target.style.borderColor = "#185a9d")}
              onMouseOut={(e) => (e.target.style.borderColor = "#000000ff")}
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#185a9d",
              color: "#fff",
              borderRadius: "0.75rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              boxShadow: "0 2px 8px rgba(24,90,157,0.10)",
              border: "none",
              transition: "background 0.3s, box-shadow 0.3s",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#14487a";
              e.target.style.boxShadow = "0 4px 16px rgba(24,90,157,0.18)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#185a9d";
              e.target.style.boxShadow = "0 2px 8px rgba(24,90,157,0.10)";
            }}
          >
            Create Account
          </button>
        </form>

        <p
          className="mt-3 text-center mb-0"
          style={{ fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif' }}
        >
          Already have an account?...{" "}
          <Link
            to="/login"
            style={{ color: "#185a9d", fontWeight: "500" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
