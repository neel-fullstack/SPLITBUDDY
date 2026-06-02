import React from "react";
import Sidebar from "./Sidebar"; // ✅ Import your Sidebar component

export default function Dashboard({ setIsLoggedIn }) {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar with setIsLoggedIn passed down */}
        <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />

        {/* Content Area */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* Your main dashboard content here */}
          <h2>Welcome to the Admin Dashboard</h2>
        </div>
      </div>
    </div>
  );
}
