import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Exportdata = () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  return (
    <div className="container-fluid vh-100 p-0">
      {/* Header */}
      <Header user={user} />

      <div className="row h-100 m-0">
        {/* Sidebar on the left */}
        <Sidebar user={user} />

        {/* Page content on the right */}
        <div className="col-md-9 col-lg-10 p-4">
          <h2>Export Data Page Content</h2>
        </div>
      </div>
    </div>
  );
};

export default Exportdata;
