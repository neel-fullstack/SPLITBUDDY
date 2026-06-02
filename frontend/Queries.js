import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Queries = () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({});

  // Fetch all queries
  const fetchQueries = () => {
    axios
      .get("http://localhost:4000/api/query")
      .then((res) => setQueries(res.data))
      .catch((err) => console.error("Error fetching queries:", err));
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // Send reply and update status to 'resolved'
  const handleReply = async (queryId, userEmail) => {
    if (!replyText[queryId]) return alert("Reply cannot be empty");

    try {
      await axios.post("http://localhost:4000/send-reply", {
        email: userEmail,
        subject: "Your Query Has Been Resolved ✅",
        message: replyText[queryId],
        type: "reply",
      });

      await axios.put(`http://localhost:4000/api/query/${queryId}/status`, {
        status: "resolved",
      });

      alert("✅ Reply sent successfully and status changed to 'resolved'!");
      setReplyText((prev) => ({ ...prev, [queryId]: "" }));
      fetchQueries();
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("⚠️ Failed to send reply or update status.");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <Header user={user} />
      <div className="row h-100 m-0">
        <Sidebar user={user} />

        <div
          className="col-md-9 col-lg-10 p-4"
          style={{
            background: "#f5f6fa",
            minHeight: "100vh",
            fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
          }}
        >
          <div
            className="card shadow-sm p-4"
            style={{
              borderRadius: "1.2rem",
              background: "#fff",
              border: "none",
              boxShadow: "0 2px 12px rgba(24,90,157,0.07)",
              fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <style>
              {`
                .queries-table::-webkit-scrollbar {
                  width: 8px;
                }
                .queries-table::-webkit-scrollbar-thumb {
                  background: #185a9d;
                  border-radius: 8px;
                }
                .queries-table::-webkit-scrollbar-track {
                  background: #f5f6fa;
                  border-radius: 8px;
                }
              `}
            </style>
            <div
              className="queries-table"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table
                className="table"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  width: "100%",
                  background: "#fff",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 1px 8px rgba(24,90,157,0.04)",
                }}
              >
                <thead
                  style={{
                    background:
                      "linear-gradient(90deg, #185a9d 60%, #43cea2 100%)",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    letterSpacing: "1px",
                  }}
                >
                  <tr>
                    <th style={{ padding: "0.75rem" }}>Query ID</th>
                    <th style={{ padding: "0.75rem" }}>Name</th>
                    <th style={{ padding: "0.75rem" }}>Email</th>
                    <th style={{ padding: "0.75rem" }}>Category</th>
                    <th style={{ padding: "0.75rem" }}>Message</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                    <th style={{ padding: "0.75rem" }}>Created At</th>
                    <th style={{ padding: "0.75rem" }}>Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.length > 0 ? (
                    queries.map((q, idx) => (
                      <tr
                        key={q.query_id}
                        style={{
                          background: idx % 2 === 0 ? "#f5f6fa" : "#fff",
                        }}
                      >
                        <td style={{ padding: "0.7rem" }}>{q.query_id}</td>
                        <td style={{ padding: "0.7rem" }}>{q.user_name || "—"}</td>
                        <td style={{ padding: "0.7rem", color: "#185a9d" }}>{q.user_email || "—"}</td>
                        <td style={{ padding: "0.7rem" }}>{q.category}</td>
                        <td style={{ padding: "0.7rem" }} title={q.message}>
                          {q.message?.length > 30
                            ? q.message.substring(0, 30) + "..."
                            : q.message}
                        </td>
                        <td
                          style={{
                            padding: "0.7rem",
                            fontWeight: "600",
                            color:
                              q.status === "resolved"
                                ? "green"
                                : q.status === "open"
                                ? "orange"
                                : "#555",
                            textTransform: "capitalize",
                          }}
                        >
                          {q.status}
                        </td>
                        <td style={{ padding: "0.7rem" }}>
                          {new Date(q.created_at).toLocaleString()}
                        </td>
                        <td style={{ padding: "0.7rem" }}>
                          {q.status === "resolved" ? (
                            <span
                              style={{
                                color: "green",
                                fontWeight: "600",
                              }}
                            >
                              ✅ Replied
                            </span>
                          ) : (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Type reply..."
                                value={replyText[q.query_id] || ""}
                                onChange={(e) =>
                                  setReplyText((prev) => ({
                                    ...prev,
                                    [q.query_id]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                className="btn"
                                style={{
                                  background: "#185a9d",
                                  color: "#fff",
                                  borderRadius: "0.75rem",
                                  fontWeight: "600",
                                  border: "none",
                                  padding: "0.4em 1em",
                                }}
                                onClick={() =>
                                  handleReply(q.query_id, q.user_email)
                                }
                              >
                               Send
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center"
                        style={{ color: "#888", padding: "1rem" }}
                      >
                        No queries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queries;
