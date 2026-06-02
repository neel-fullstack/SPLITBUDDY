import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email"); // get email from link

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: trimmedPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password reset successfully!");
        setPassword("");
        setConfirm("");
        setTimeout(() => navigate("/login"), 2000); // redirect after 2s
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
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
          <h4 className="fw-bold" style={{ color: "#185a9d" }}>
            Reset Password
          </h4>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-2">
            <input
              type="password"
              placeholder="New Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#185a9d")}
              onBlur={(e) => (e.target.style.borderColor = "#000000ff")}
              onMouseOver={(e) => (e.target.style.borderColor = "#185a9d")}
              onMouseOut={(e) => (e.target.style.borderColor = "#000000ff")}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #000000ff",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
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
            }}
            disabled={loading}
            onMouseOver={(e) => {
              e.target.style.background = "#14487a";
              e.target.style.boxShadow = "0 4px 16px rgba(24,90,157,0.18)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#185a9d";
              e.target.style.boxShadow = "0 2px 8px rgba(24,90,157,0.10)";
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
