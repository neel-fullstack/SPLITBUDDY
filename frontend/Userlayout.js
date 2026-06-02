// src/User/UserLayout.js
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function UserLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <UserHeader />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
