import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const Activeusers = () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users")
      .then((res) => {
        // filter out admin users
        const filteredUsers = res.data.filter((u) => u.role !== "admin");
        setUsers(filteredUsers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div
      className="container-fluid vh-100 p-0"
      style={{
        background: "#f5f6fa",
        fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      }}
    >
      <Header user={user} />
      <div className="row h-100 m-0" style={{ minHeight: "100vh" }}>
        <Sidebar user={user} />

        <div
          className="col-md-9 col-lg-10 p-4"
          style={{
            background: "#f5f6fa",
            minHeight: "100vh",
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
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="table-responsive"
              style={{
                overflowY: "auto",
                maxHeight: "400px",
                borderRadius: "1rem",
                scrollbarWidth: "thin",
                scrollbarColor: "#185a9d #f5f6fa",
                /* Custom scrollbar for Webkit browsers */
                msOverflowStyle: "auto",
              }}
            >
              <style>
                {`
                  .table-responsive::-webkit-scrollbar {
                    width: 8px;
                  }
                  .table-responsive::-webkit-scrollbar-thumb {
                    background: #185a9d;
                    border-radius: 8px;
                  }
                  .table-responsive::-webkit-scrollbar-track {
                    background: #f5f6fa;
                    border-radius: 8px;
                  }
                `}
              </style>
              <table
                className="table"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  width: "100%",
                  fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                  background: "#fff",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 1px 8px rgba(24,90,157,0.04)",
                }}
              >
                <thead
                  style={{
                    background: "linear-gradient(90deg, #185a9d 60%, #43cea2 100%)",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    letterSpacing: "1px",
                  }}
                >
                  <tr>
                    <th style={{ borderTopLeftRadius: "1rem", padding: "0.75rem" }}>Name</th>
                    <th style={{ borderTopRightRadius: "1rem", padding: "0.75rem" }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u, idx) => (
                      <tr
                        key={u.user_id}
                        style={{
                          background: idx % 2 === 0 ? "#f5f6fa" : "#fff",
                          transition: "background 0.2s",
                        }}
                      >
                        <td style={{ fontWeight: "500", color: "#222", padding: "0.7rem" }}>{u.name}</td>
                        <td style={{ color: "#185a9d", padding: "0.7rem" }}>{u.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center" style={{ color: "#888" }}>
                        No users found
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

export default Activeusers; 

