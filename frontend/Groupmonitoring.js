import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const GroupMonitoring = () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/groups-with-members")
      .then((res) => {
        setGroups(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching groups:", err);
        setError("Failed to fetch groups");
        setLoading(false);
      });
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.group_id - a.group_id); // Newest first

  return (
    <div className="container-fluid vh-100 p-0" style={{ background: "#f5f6fa" }}>
      <Header user={user} searchValue={search} onSearchChange={setSearch} />
      <div className="row h-100 m-0">
        <Sidebar user={user} />
        <div className="col-md-9 col-lg-10 p-4">
          <div
            className="card shadow-sm mb-4"
            style={{
              borderRadius: "1.2rem",
              border: "none",
              background: "#fff",
              boxShadow: "0 4px 16px rgba(24,90,157,0.10)",
              overflow: "hidden",
              height: "calc(100vh - 100px)", // fit screen, adjust if header height changes
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="card-body"
              style={{
                padding: "2rem",
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                scrollbarWidth: "thin",
                scrollbarColor: "#185a9d #f5f6fa",
              }}
            >
              {/* Add style tag for hover effect */}
              <style>
                {`
                  .group-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                  }
                  .group-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 8px 32px rgba(78,84,200,0.18), 0 2px 8px rgba(24,90,157,0.10);
                    z-index: 2;
                  }
                  .card-body {
                    scrollbar-width: thin;
                    scrollbar-color: #4e54c8 #e3e8ee;
                  }
                  .card-body::-webkit-scrollbar {
                    width: 10px;
                    background: #e3e8ee;
                    border-radius: 8px;
                  }
                  .card-body::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #4e54c8 60%, #43cea2 100%);
                    border-radius: 8px;
                    border: 2px solid #e3e8ee;
                  }
                  .card-body::-webkit-scrollbar-track {
                    background: #e3e8ee;
                    border-radius: 8px;
                  }
                `}
              </style>
              {loading && <p>Loading groups...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && filteredGroups.length > 0 ? (
                <div className="row" style={{ gap: "2rem 0" }}>
                  {filteredGroups.map((group) => (
                    <div key={group.group_id} className="col-md-6 mb-4">
                      <div
                        className="card shadow-sm h-100 group-card"
                        style={{
                          borderRadius: "1rem",
                          border: "none",
                          background: "#f8fafc",
                          boxShadow: "0 2px 8px rgba(24,90,157,0.07)",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            background: "linear-gradient(90deg, #185a9d 100%)",
                            color: "#fff",
                            padding: "0.8rem 1.2rem",
                            borderTopLeftRadius: "1rem",
                            borderTopRightRadius: "1rem",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            letterSpacing: "1px",
                          }}
                        >
                          {group.group_name}
                        </div>
                        <div className="card-body" style={{ padding: "1.2rem" }}>
                          <h6 style={{ color: "#185a9d", fontWeight: 600 }}>
                            Members: {group.members.length}
                          </h6>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {group.members.length > 0 ? (
                              group.members.map((m) => (
                                <li
                                  key={m.user_id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    padding: "0.7rem 0",
                                    borderBottom: "1px solid #e3e8ee",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "50%",
                                      background: "linear-gradient(135deg, #185a9d 60%, #ff3b3b 100%)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                      fontWeight: "700",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    {m.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: "500", color: "#222", fontSize: "1rem" }}>
                                      {m.name}
                                    </span>
                                    <br />
                                    <span style={{ color: "#185a9d", fontSize: "0.95rem" }}>
                                      {m.email}
                                    </span>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li style={{ color: "#888", padding: "0.7rem 0" }}>
                                No members
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <p style={{ color: "#888", fontWeight: 500 }}>No groups found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMonitoring;
