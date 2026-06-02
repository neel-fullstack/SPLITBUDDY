import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // Registration logic here...
    // Example:
    // const res = await fetch("http://localhost:4000/api/users/register", { ... });
    // Handle response and navigation
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#fff" }}
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
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo/image.png"
            alt="SplitBuddy Logo"
            style={{
              width: "250px",
              marginBottom: "18px",
              borderRadius: "24px",
              boxShadow: "0 4px 24px rgba(67,206,162,0.18)",
              background: "linear-gradient(90deg, #43cea2 0%, #ff6e7f 100%)",
              padding: "12px"
            }}
          />
          <h4 className="fw-bold" style={{ color: "#43cea2" }}>
            Create Account
          </h4>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1.5px solid #43cea2",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#ff6e7f"}
              onBlur={e => e.target.style.borderColor = "#43cea2"}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1.5px solid #43cea2",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#ff6e7f"}
              onBlur={e => e.target.style.borderColor = "#43cea2"}
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
              required
              style={{
                borderRadius: "0.75rem",
                border: "1.5px solid #43cea2",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#ff6e7f"}
              onBlur={e => e.target.style.borderColor = "#43cea2"}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                borderRadius: "0.75rem",
                border: "1.5px solid #43cea2",
                boxShadow: "0 1px 4px rgba(67,206,162,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#ff6e7f"}
              onBlur={e => e.target.style.borderColor = "#43cea2"}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "linear-gradient(90deg, #43cea2 0%, #ff6e7f 100%)",
              color: "#fff",
              borderRadius: "0.75rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              boxShadow: "0 2px 8px rgba(67,206,162,0.10)",
              border: "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
            onMouseOver={e => {
              e.target.style.background = "linear-gradient(90deg, #ff6e7f 0%, #43cea2 100%)";
              e.target.style.boxShadow = "0 4px 16px rgba(255,110,127,0.18)";
            }}
            onMouseOut={e => {
              e.target.style.background = "linear-gradient(90deg, #43cea2 0%, #ff6e7f 100%)";
              e.target.style.boxShadow = "0 2px 8px rgba(67,206,162,0.10)";
            }}
          >
            Register
          </button>
        </form>

        <p className="mt-3 text-center mb-0">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#185a9d", fontWeight: "500" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}