// src/User/Groups.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function Groups() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("loggedInUser")) || {};
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState({});
  const [showMembers, setShowMembers] = useState({});
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCurrency, setNewGroupCurrency] = useState("INR"); // Add this line
  const [joinGroupId, setJoinGroupId] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredGroupId, setHoveredGroupId] = useState(null);

  // Fetch groups of current user
  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/groups/user/${user.user_id}`);
      if (!res.ok) {
        // If 404 or error, treat as no groups
        setGroups([]);
        return;
      }
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      
      setGroups([]); // Show "No groups to display"
      // No alert, just log error and continue
    }
  }, [user.user_id]);

  // Fetch members of group
  const fetchMembers = useCallback(async (groupId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}/members`);
      if (!res.ok) throw new Error(`Failed to fetch members: ${res.statusText}`);
      const data = await res.json();
      setMembers((prev) => ({ ...prev, [groupId]: data }));
    } catch (err) {
      console.error("Failed to load members", err);
      setMembers((prev) => ({ ...prev, [groupId]: [] })); // Show no members
      // No alert, just log error and continue
    }
  }, []);

  // Fetch all users (for admin bulk add)
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
      setAllUsers([]); // Show no users
      // No alert, just log error and continue
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (user.user_id) {
      fetchGroups();
      fetchAllUsers();
    }
  });

  // Always fetch members for all groups when groups change
  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((g) => {
        fetchMembers(g.group_id);
      });
    }
  }, [groups, fetchMembers]);

  // Create group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: newGroupName.trim(),
          created_by: user.user_id,
          currency: newGroupCurrency, // Add this line
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to create group: " + (errorData.error || errorData.message));
        return;
      }

      setNewGroupName("");
      fetchGroups();
      alert("Group created successfully!");
    } catch (err) {
      console.error("Error creating group", err);
      alert("An error occurred while creating the group.");
    }
  };

  // Join group by ID
  const handleJoinGroup = async () => {
    if (!joinGroupId.trim()) {
      alert("Please enter a valid group ID.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/groups/${joinGroupId.trim()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to join group: " + (errorData.error || errorData.message));
        return;
      }

      setJoinGroupId("");
      fetchGroups();
      alert("Joined group successfully!");
    } catch (err) {
      console.error("Error joining group", err);
      alert("An error occurred while joining the group.");
    }
  };

  // Delete group (admin deletes group for everyone)
  const handleDeleteGroup = async (groupId) => {
    const confirmed = window.confirm("Are you sure you want to delete this group for everyone?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }), // authorization
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to delete group: " + (errorData.error || errorData.message));
        return;
      }

      alert("Group deleted successfully!");
      fetchGroups();
    } catch (err) {
      console.error("Error deleting group", err);
      alert("An error occurred while deleting the group.");
    }
  };

  // Exit group (user leaves the group; if admin leaves, backend handles assigning new admin or deleting if last member)
  const handleExitGroup = async (groupId) => {
    const confirmed = window.confirm("Are you sure you want to leave this group?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}/exit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      // Defensive check for JSON or error HTML
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON response but received: ${text.substring(0, 150)}`);
      }

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to exit group: " + (data.error || data.message));
      } else {
        alert(data.message || "You have exited the group.");
        fetchGroups();
      }
    } catch (err) {
      console.error("Error exiting group", err);
      alert("An error occurred while trying to exit the group: " + err.message);
    }
  };

  // handleDeleteMember is not used, so it has been removed to fix the ESLint warning.

  // Bulk add members (admin only)
  const addMembers = async (groupId) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add.");
      return;
    }

    try {
      for (let uid of selectedUsers) {
        const res = await fetch(`http://localhost:4000/api/groups/${groupId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: uid }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(`Failed to add user ${uid}: ${errorData.error || errorData.message}`);
          return;
        }
      }
      setSelectedUsers([]);
      fetchMembers(groupId);
      alert("Selected users added successfully!");
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding members.");
    }
  };

  // Navigate to ExpensesAll page for a group
  const handleAddExpense = (groupId) => {
    navigate(`/expenses/${groupId}`);
  };

  return (
    <>
      <UserHeader />
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          fontFamily: "Segoe UI, Arial, sans-serif",
          background: "#f4f7fb",
          minHeight: "100vh",
        }}
      >
       
        {/* Create & Join - Card Style */}
        <div className="row g-4 justify-content-center mb-4">
          <div className="col-md-5 col-lg-4">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
                background: "#fff",
                minHeight: "120px",
                boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(24, 90, 157, 0.25)";
                e.currentTarget.style.background = "#185a9d";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#fff");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#fff");
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(24, 90, 157, 0.18)";
                e.currentTarget.style.background = "#fff";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#185a9d");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#185a9d");
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center w-100">
                <h5 className="card-title fw-bold mb-2" style={{color: '#185a9d'}}>Create New Group</h5>
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="New group name"
                    className="form-control me-2"
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      width: "180px",
                      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                    }}
                  />
                  <select
                    value={newGroupCurrency}
                    onChange={e => setNewGroupCurrency(e.target.value)}
                    className="form-select me-2"
                    style={{ width: "120px", borderRadius: "8px" }}
                  >
                    <option value="INR">INR ₹</option>
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                    <option value="JPY">JPY ¥</option>
                    {/* Add more as needed */}
                  </select>
                  <button
                    onClick={handleCreateGroup}
                    className="btn"
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontWeight: 'bold',
                      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                      background: '#185a9d',
                      color: 'white',
                      border: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#14487a'}
                    onMouseOut={e => e.currentTarget.style.background = '#185a9d'}
                  >➕ Create</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-5 col-lg-4">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
                background: "#fff",
                minHeight: "120px",
                boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(24, 90, 157, 0.25)";
                e.currentTarget.style.background = "#185a9d";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#fff");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#fff");
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(24, 90, 157, 0.18)";
                e.currentTarget.style.background = "#fff";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#185a9d");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#185a9d");
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center w-100">
                <h5 className="card-title fw-bold mb-2" style={{color: '#185a9d'}}>Join Group</h5>
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <input
                    value={joinGroupId}
                    onChange={(e) => setJoinGroupId(e.target.value)}
                    placeholder="Enter group ID to join"
                    className="form-control me-2"
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      width: "180px",
                      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                    }}
                  />
                  <button
                    onClick={handleJoinGroup}
                    className="btn"
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontWeight: 'bold',
                      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                      background: '#185a9d',
                      color: 'white',
                      border: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#14487a'}
                    onMouseOut={e => e.currentTarget.style.background = '#185a9d'}
                  >🔑 Join</button>
                </div>
              </div>
            </div>
          </div>
        </div>
 {/* Title Cards - moved above Create & Join */}
        <div className="row g-4 justify-content-center mb-2">
          <div className="col-md-4 col-lg-4">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "16px",
                background: "#185a9d",
                minHeight: "70px",
                boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                letterSpacing: '1px',
              }}
            >
              GROUP's
            </div>
          </div>
          <div className="col-md-8 col-lg-8">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "16px",
                background: "#185a9d",
                minHeight: "70px",
                boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                letterSpacing: '1px',
              }}
            >
              DETAIL's
            </div>
          </div>
        </div>
        {/* Groups List */}
        {groups.length === 0 ? (
          <p style={{ color: "#777" }}>No groups to display.</p>
        ) : (
          <div className="row g-4 mt-2 justify-content-center">
            {groups
              .slice() // copy array
              .sort((a, b) => b.group_id - a.group_id) // Newest first
              .map((g, idx) => (
                <React.Fragment key={g.group_id}>
                  <div className="row mb-4 justify-content-center align-items-stretch">
                    {/* GROUP-ID Card */}
                    <div className="col-md-4 col-lg-4 mb-0">
                      <div
                        className="card border-0 shadow-lg group-id-card"
                        style={{
                          borderRadius: "16px",
                          background: hoveredGroupId === g.group_id ? "#185a9d" : "#f8f9fa",
                          minHeight: "100%",
                          boxShadow: hoveredGroupId === g.group_id ? "0 12px 40px rgba(24, 90, 157, 0.25)" : "0 8px 32px rgba(24, 90, 157, 0.18)",
                          fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
                          color: hoveredGroupId === g.group_id ? '#fff' : '#185a9d',
                        }}
                        onMouseOver={() => setHoveredGroupId(g.group_id)}
                        onMouseOut={() => setHoveredGroupId(null)}
                      >
                        <div style={{
                          fontWeight: "bold",
                          fontSize: "2.2rem",
                          letterSpacing: "2px",
                          textAlign: "center",
                          border: "2px solid #185a9d",
                          borderRadius: "8px",
                          padding: "8px 0",
                          background: hoveredGroupId === g.group_id ? "#185a9d" : "#f8f9fa",
                          width: "80%",
                          margin: "0 auto",
                          color: hoveredGroupId === g.group_id ? '#fff' : '#185a9d',
                        }}>
                          {g.group_name}
                          <span style={{ fontSize: "1rem", fontWeight: "normal", marginLeft: "8px", color: hoveredGroupId === g.group_id ? "#fff" : "#888" }}>
                            (ID: #{g.group_id})
                          </span>
                          {/* Currency below name, with symbol */}
                          {g.currency && (
                            <div style={{ marginTop: "8px", fontSize: "1.3rem", fontWeight: "bold", color: hoveredGroupId === g.group_id ? "#fff" : "#28a745" }}>
                              {(() => {
                                switch (g.currency) {
                                  case "INR": return "₹ INR";
                                  case "USD": return "$ USD";
                                  case "EUR": return "€ EUR";
                                  case "GBP": return "£ GBP";
                                  case "JPY": return "¥ JPY";
                                  default: return g.currency;
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Main Group Card */}
                    <div className="col-md-8 col-lg-8 mb-0">
                      <div
                        className="card border-0 shadow-lg group-main-card"
                        style={{
                          borderRadius: "16px",
                          background: "#fff",
                          minHeight: "220px",
                          boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                          fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                          padding: "32px 24px 24px 24px",
                          position: "relative",
                          textAlign: "center",
                          transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
                          color: '#185a9d',
                        }}
                        onMouseOver={() => setHoveredGroupId(g.group_id)}
                        onMouseOut={() => setHoveredGroupId(null)}
                      >
                        {/* Add Members Button - now above members list, right aligned */}
                        {g.created_by === user.user_id && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "80%", margin: "0 auto 8px auto" }}>
                            <button
                              onClick={() => {
                                setShowMembers((prev) => ({
                                  ...prev,
                                  [g.group_id]: !prev[g.group_id],
                                }));
                              }}
                              className="btn btn-primary"
                              style={{
                                borderRadius: "8px",
                                fontWeight: "bold",
                                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                                background: '#185a9d',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(24, 90, 157, 0.10)',
                                padding: '8px 18px',
                                fontSize: '1rem',
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.background = '#185a9d';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.background = '#185a9d';
                                e.currentTarget.style.color = '#fff';
                              }}
                            >{showMembers[g.group_id] ? "➖ Hide Members" : "➕ Add Members"}</button>
                          </div>
                        )}
                        {/* Members List Preview - always visible */}
                        <div style={{ textAlign: "left", margin: "0 auto 12px auto", width: "80%" }}>
                          {members[g.group_id]?.length > 0 ? (
                            <div style={{
                              maxHeight: members[g.group_id].length > 5 ? '220px' : 'none',
                              overflowY: members[g.group_id].length > 5 ? 'auto' : 'visible',
                             // borderRadius: '8px',
                             // border: 'none',
                              background: 'transparent',
                              //boxShadow: members[g.group_id].length > 5 ? '0 2px 8px rgba(24, 90, 157, 0.07)' : 'none',
                              //paddingRight: '4px',
                            }}>
                              {members[g.group_id].map((m, i) => (
                                <div key={m.user_id} style={{ fontSize: "1.1rem", color: "#222", marginBottom: "8px" }}>
                                  <span style={{ fontWeight: "bold" }}>{i + 1} - {m.name}</span>
                                  <span style={{ color: "#888", marginLeft: "8px" }}>({m.email})</span>
                                  {m.user_id === g.created_by && (
                                    <span style={{ color: "#28a745", fontWeight: "bold", marginLeft: "8px" }}>(ADMIN)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        {/* Add Members Section - toggled by button */}
                        {g.created_by === user.user_id && showMembers[g.group_id] && (
                          <div style={{ width: "80%", margin: "0 auto" }}>
                            <input
                              type="text"
                              placeholder="Search users by NAME or @EMAIl..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "12px",
                                fontSize: "1.1rem",
                                width: '100%',
                                boxSizing: 'border-box',
                              }}
                            />
                            {searchTerm.trim() !== "" && (
                              <ul style={{
                                paddingLeft: "0",
                                listStyle: 'none',
                                maxHeight: '220px',
                                overflowY: 'auto',
                                borderRadius: '8px',
                                background: 'none',
                                marginBottom: '8px',
                                textAlign: 'left',
                                color: '#222',
                              }}>
                                {allUsers
                                  .filter(
                                    (u) =>
                                      u.user_id !== user.user_id &&
                                      u.user_id !== g.created_by &&
                                      !members[g.group_id]?.some((m) => m.user_id === u.user_id) &&
                                      u.email !== "Admin@splitbuddy.com" &&
                                      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                  )
                                  .map((u) => (
                                    <li key={u.user_id} style={{ marginBottom: "6px" }}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={selectedUsers.includes(u.user_id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedUsers([...selectedUsers, u.user_id]);
                                            } else {
                                              setSelectedUsers(
                                                selectedUsers.filter((id) => id !== u.user_id)
                                              );
                                            }
                                          }}
                                          style={{ marginRight: "6px" }}
                                        />
                                        <span style={{ color: "#000000ff", fontWeight: "bold" }}>{u.name}</span>
                                        <span style={{ color: "#777", fontStyle: "italic", marginLeft: "6px" }}>({u.email})</span>
                                      </label>
                                    </li>
                                  ))}
                                {allUsers.filter(
                                  (u) =>
                                    u.user_id !== user.user_id &&
                                    u.user_id !== g.created_by &&
                                    !members[g.group_id]?.some((m) => m.user_id === u.user_id) &&
                                    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                ).length === 0 && (
                                  <p style={{ color: "#888" }}>No users match your search.</p>
                                )}
                              </ul>
                            )}
                            <button
                              onClick={() => addMembers(g.group_id)}
                              disabled={selectedUsers.length === 0}
                              className={`btn btn-success btn-sm mt-2${selectedUsers.length === 0 ? ' disabled' : ''}`}
                              style={{
                                borderRadius: '12px',
                                width: '100%',
                                fontWeight: 'bold',
                                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                                padding: '14px 0',
                                boxShadow: '0 4px 16px rgba(24, 90, 157, 0.10)',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                fontSize: '1.1rem',
                                marginBottom: '10px',
                              }}
                              onMouseOver={e => e.currentTarget.style.background = '#218838'}
                              onMouseOut={e => e.currentTarget.style.background = '#28a745'}
                            >✅ Add Selected</button>
                          </div>
                        )}
                        {/* Action Buttons */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "10px", width: "80%", margin: "0 auto" }}>
                         <button
                            onClick={() => handleAddExpense(g.group_id)}
                            className="btn btn-warning"
                            style={{ borderRadius: '8px', fontWeight: 'bold', padding: '8px 18px', fontSize: '1rem', color: 'white', width: '33.33%' }}
                          >💰 Expenses</button>
                          {g.created_by === user.user_id && (
                            <button
                              onClick={() => handleDeleteGroup(g.group_id)}
                              className="btn btn-danger"
                              style={{ borderRadius: '8px', fontWeight: 'bold', padding: '8px 18px', fontSize: '1rem', width: '33.33%' }}
                            >🗑️ Delete</button>
                          )}
                          <button
                            onClick={() => handleExitGroup(g.group_id)}
                            className="btn btn-secondary"
                            style={{ borderRadius: '8px', fontWeight: 'bold', padding: '8px 18px', fontSize: '1rem', width: '33.33%' }}
                          >🚪 Exit</button>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        )}
      </div>
     <UserFooter />
    </>
  );
}

