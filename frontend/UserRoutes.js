// src/User/UserRoutes.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// User Layout (with Sidebar)
import UserLayout from "./Userlayout";

// User Pages
import UserHome from "./UserHome";
// import Groups from "./Groups";
// import GroupDetail from "./GroupDetail";
// import NewGroup from "./NewGroup";
// import ExpensesAll from "./ExpensesAll";
// import BalancesPage from "./BalancesPage";
import SettleUpPage from "./SettleUpPage";
// import Settings from "./Settings";

export default function UserRoutes() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
  }, [location]);

  const isUser = user?.role === "user";

  return (
    <Routes>
      {/* User protected routes (with persistent sidebar) */}
      <Route
        path="/user"
        element={isUser ? <UserLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="Userhome" element={<UserHome />} />
        <Route path="settleup" element={<SettleUpPage />} />
        {/* Add more user pages later: */}
            {/* <Route path="my-balance" element={<MyBalance />} /> */}
            {/* <Route path="groups-joined" element={<NewGroup />} /> */}
            {/* <Route path="pending-settlements" element={<PendingSettlements />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="settings" element={<Settings />} />
         */}
      </Route>

      {/* Default */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

      {/* Catch-all */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}