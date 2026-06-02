import { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function ContactUs() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const token = sessionStorage.getItem("token");

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      setStatus("⚠️ Please enter your message.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: user?.user_id || null,
          category,
          message,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setStatus("✅ Your query has been submitted successfully!");
        setMessage("");
        setCategory("General");
      } else {
        setStatus(
          "❌ Failed to submit query: " + (data.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error submitting query:", err);
      setStatus("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <>
      <UserHeader />
      <div
        className="d-flex justify-content-center align-items-start py-5 bg-light"
        style={{
          minHeight: "83.5vh",
          fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          className="bg-white rounded-4 shadow-lg p-5 w-100"
          style={{
            maxWidth: "600px",
            fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
          }}
        >
          <h2
            className="mb-4 text-center fw-bold"
            style={{ color: "#185a9d" }}
          >
            📩 Contact Us
          </h2>

          {status && (
            <div
              className={`alert text-center mb-4 ${
                status.includes("✅")
                  ? "alert-success"
                  : status.includes("❌")
                  ? "alert-danger"
                  : "alert-warning"
              }`}
              style={{ fontFamily: "Poppins, Segoe UI, Arial, sans-serif" }}
            >
              {status}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
            }}
          >
            <div className="mb-3 text-start">
              <label
                className="form-label fw-bold"
                style={{ color: "#185a9d" }}
              >
                Name
              </label>
              <input
                type="text"
                className="form-control"
                value={name}
                readOnly
              />
            </div>

            <div className="mb-3 text-start">
              <label
                className="form-label fw-bold"
                style={{ color: "#185a9d" }}
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                readOnly
              />
            </div>

            <div className="mb-3 text-start">
              <label
                className="form-label fw-bold"
                style={{ color: "#185a9d" }}
              >
                Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Bug">Bug</option>
                <option value="Payment">Payment</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="mb-3 text-start">
              <label
                className="form-label fw-bold"
                style={{ color: "#185a9d" }}
              >
                Message
              </label>
              <textarea
                className="form-control"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn fw-semibold"
                style={{
                  backgroundColor: "#185a9d",
                  color: "#fff",
                  border: "none",
                  fontWeight: "600",
                  fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1565c0";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#185a9d";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                📤 Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
