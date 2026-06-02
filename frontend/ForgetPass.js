import React, { useState } from "react";

export default function ForgetPass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset email sent!");
      } else {
        setError(data.message || "Failed to send email. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again later.");
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
            Forgot Password?
          </h4>
        </div>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
