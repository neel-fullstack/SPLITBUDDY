// src/User/UserSidebar.js
import { Link, useNavigate } from "react-router-dom";

export default function UserSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  return (
    <div className="col-2 bg-light border-end h-100 p-3 d-flex flex-column">
      <h5 className="mb-4">User Menu</h5>
      <ul className="nav flex-column mb-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/home">
            🏠 Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/groups">
            👥 Groups
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link" to="/group_members">
            👥 Group Members
          </Link>
        </li> */}
        <li className="nav-item">
          <Link className="nav-link" to="/newgroup">
            ➕ New Group
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/expenses">
            💰 Expenses
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/balances">
            ⚖️ Balances
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/settle-up">
            ✅ Settle Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/settings">
            ⚙️ Settings
          </Link>
        </li>
      </ul>

      <button
        className="btn btn-outline-danger mt-auto"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>
    </div>
  );
}
