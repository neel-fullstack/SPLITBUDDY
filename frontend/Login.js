import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          navigate("/overview", { replace: true });
        } else {
          navigate("/user/home", { replace: true });
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#ffffffff",
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', // Changed font family
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
          fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', // Changed font family
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
          <h4 className="fw-bold" style={{ color: "#185a9d", fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif' }}>
            Welcome Back!
          </h4>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#0080ffff"}
              onBlur={e => e.target.style.borderColor = "#000000ff"}
              onMouseOver={e => e.target.style.borderColor = "#185a9d"} // Blue on hover
              onMouseOut={e => e.target.style.borderColor = "#000000ff"} // Black on mouse out
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#185a9d"}
              onBlur={e => e.target.style.borderColor = "#000000ff"}
              onMouseOver={e => e.target.style.borderColor = "#185a9d"} // Blue on hover
              onMouseOut={e => e.target.style.borderColor = "#000000ff"} // Black on mouse out
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#185a9d", // Simple blue
              color: "#fff",
              borderRadius: "0.75rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              boxShadow: "0 2px 8px rgba(24,90,157,0.10)",
              border: "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
            onMouseOver={e => {
              e.target.style.background = "#14487a"; // Darker blue on hover
              e.target.style.boxShadow = "0 4px 16px rgba(24,90,157,0.18)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#185a9d";
              e.target.style.boxShadow = "0 2px 8px rgba(24,90,157,0.10)";
            }}
          >
            Login
          </button>
        </form>

        <p className="mt-3 text-center mb-0">
          New user?...{" "}
          <Link to="/register" style={{ color: "#185a9d", fontWeight: "500" }}>
       
            Register here
          </Link>
          <br></br>
          <Link to="/forgetpass" style={{ color: "#185a9d", fontWeight: "500" }}>
       
            Forgot Password ??
          </Link>
        </p>
      </div>
    </div>
  );
}
