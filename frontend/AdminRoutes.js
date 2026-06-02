import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Admin components
import Overview from "./Overview";
import Activeusers from "./Activeusers";
import Usermanagement from "./Usermanagement";
import Contentmnagement from "./Contentmnagement";
import Groupmonitoring from "./Groupmonitoring";
import Queries from "./Queries";
import Exportdata from "./Exportdata";
import Login from "./Login";
import Registration from "./registration";

// User components
import UserLayout from "../User/Userlayout";
import UserHome from "../User/UserHome";
import Groups from "../User/Groups";
import NewGroup from "../User/NewGroup";
import ExpensesAll from "../User/ExpensesAll";
import BalancesPage from "../User/BalancesPage";
import SettleUpPage from "../User/SettleUpPage";
import Settings from "../User/Settings";
import GroupMembers from "../User/GroupDetail";
import ForgetPass from "../User/ForgetPass";
import ResetPassword from "../User/ResetPass";
import ContactUs from "../User/ContactUs";

export default function AdminRoutes() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Read session on every route change
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
  }, [location]);

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <Routes>
      {/* Public: Login */}
      <Route
        path="/login"
        element={
          user ? (
            isAdmin ? <Navigate to="/overview" replace /> : <Navigate to="/user/home" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Public: Register (only for non-logged-in, always creates a 'user') */}
      <Route
        path="/register"
        element={user ? <Navigate to="/login" replace /> : <Registration />}
      />

      {/* Admin protected routes */}
      <Route
        path="/overview"
        element={isAdmin ? <Overview /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/activeusers"
        element={isAdmin ? <Activeusers /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/usermanagement"
        element={isAdmin ? <Usermanagement /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/contentmnagement"
        element={isAdmin ? <Contentmnagement /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/groupmonitoring"
        element={isAdmin ? <Groupmonitoring /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/query"
        element={isAdmin ? <Queries /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/exportdata"
        element={isAdmin ? <Exportdata /> : <Navigate to="/login" replace />}
      />

      {/* User protected routes (with persistent sidebar) */}

      <Route element={<UserLayout />}></Route>

      <Route
        path="/groups"
        element={isUser ? <Groups /> : <Navigate to="/login" replace />}
      />

     <Route
        path="/forgetpass"
        element={user ? <Navigate to="/login" replace /> : <ForgetPass />}
      />

        <Route
        path="/reset-password"
        element={user ? <Navigate to="/login" replace /> : <ResetPassword />}
      />

      <Route
        path="/user/groups/:groupId/members"
        element={isUser ? <GroupMembers /> : <Navigate to="/login" replace />}
      />
      
      <Route
        path="/newgroup"
        element={isUser ? <NewGroup /> : <Navigate to="/login" replace />}
      />

     <Route
       path="/expenses/:groupId"
       element={isUser ? <ExpensesAll /> : <Navigate to="/login" replace />}
    />

      
      <Route
        path="/balances"
        element={isUser ? <BalancesPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/settle-up"
        element={isUser ? <SettleUpPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/settings"
        element={isUser ? <Settings /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/contactus"
        element={isUser ? <ContactUs /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/user"
        element={isUser ? <UserLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="home" element={<UserHome />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
