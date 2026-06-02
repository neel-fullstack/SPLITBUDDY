import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const Usermanagement = () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const [users, setUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Remove user handler
  const handleRemove = (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    axios
      .delete(`http://localhost:4000/api/users/${userId}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      })
      .catch((err) => {
        // Check for MySQL foreign key error
        if (
          err.response &&
          err.response.data &&
          err.response.data.error &&
          err.response.data.error.code === "ER_ROW_IS_REFERENCED_2"
        ) {
          alert("Cannot delete user because they are already in a group.");
        } else {
          alert("Can not remove user because user is in a group.");
        }
      });
  };

  // Edit user handler
  const handleEdit = (userId) => {
    const userToEdit = users.find((u) => u.user_id === userId);
    setEditUser(userToEdit);
    setEditForm({ name: userToEdit.name, email: userToEdit.email });
    setEditModalOpen(true);
  };

  // Handle form change
  const handleFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/api/users/${editUser.user_id}`, editForm)
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === editUser.user_id ? { ...u, ...editForm } : u
          )
        );
        setEditModalOpen(false);
        setEditUser(null);
      })
      .catch((err) => alert("Error updating user"));
  };

  return (
    <div className="container-fluid vh-100 p-0">
      {/* Header */}
      <Header
        user={user}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onNewUser={(notify) => { headerRef.current = notify; }}
      />

      <div className="row h-100 m-0">
        {/* Sidebar on the left */}
        <Sidebar user={user} />

        {/* Page content on the right */}
        <div
          className="col-md-9 col-lg-10 p-4"
          style={{
            background: "#f5f6fa",
            minHeight: "100vh",
            fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
          }}
        >
          {/* Edit Modal */}
          {editModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "2rem",
                  borderRadius: "1rem",
                  minWidth: "320px",
                  boxShadow: "0 2px 12px rgba(24,90,157,0.15)",
                }}
              >
                <h5>Edit User</h5>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: "#185a9d",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      fontWeight: "600",
                      border: "none",
                      padding: "0.4em 1em",
                      marginRight: "0.5rem",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: "#888",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      fontWeight: "600",
                      border: "none",
                      padding: "0.4em 1em",
                    }}
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

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
                .user-table::-webkit-scrollbar {
                  width: 8px;
                }
                .user-table::-webkit-scrollbar-thumb {
                  background: #185a9d;
                  border-radius: 8px;
                }
                .user-table::-webkit-scrollbar-track {
                  background: #f5f6fa;
                  border-radius: 8px;
                }
              `}
            </style>
            <div
              className="user-table"
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
                    <th style={{ padding: "0.75rem" }}>Name</th>
                    <th style={{ padding: "0.75rem" }}>Email</th>
                    <th style={{ padding: "0.75rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users
                      .filter((u) => u.role !== "admin")
                      .filter((u) =>
                        u.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .sort((a, b) => b.user_id - a.user_id) // Newest first
                      .map((u, idx) => (
                        <tr key={u.user_id} style={{ background: idx % 2 === 0 ? "#f5f6fa" : "#fff" }}>
                          <td style={{ padding: "0.7rem" }}>{u.name}</td>
                          <td style={{ padding: "0.7rem", color: "#185a9d" }}>{u.email}</td>
                          <td style={{ padding: "0.7rem" }}>
                            {/* Only show Delete if user is NOT in a group */}
                            {!u.in_group && (
                              <button
                                className="btn"
                                style={{
                                  background: "#ff3b3b",
                                  color: "#fff",
                                  borderRadius: "0.75rem",
                                  fontWeight: "600",
                                  fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                                  border: "none",
                                  padding: "0.4em 1em",
                                  marginRight: "0.5rem",
                                  transition: "background 0.2s",
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#c82333")}
                                onMouseOut={(e) => (e.target.style.background = "#ff3b3b")}
                                onClick={() => handleRemove(u.user_id)}
                              >
                                🗑️
                              </button>
                            )}
                            <button
                              className="btn"
                              style={{
                                background: "#185a9d",
                                color: "#fff",
                                borderRadius: "0.75rem",
                                fontWeight: "600",
                                fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
                                border: "none",
                                padding: "0.4em 1em",
                                transition: "background 0.2s",
                              }}
                              onMouseOver={(e) => (e.target.style.background = "#14487a")}
                              onMouseOut={(e) => (e.target.style.background = "#185a9d")}
                              onClick={() => handleEdit(u.user_id)}
                            >
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center" style={{ color: "#888", padding: "1rem" }}>
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

export default Usermanagement;
