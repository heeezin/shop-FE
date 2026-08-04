import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ permissionLevel }) => {
  const { user, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        로그인 정보를 확인하는 중입니다.
      </div>
    );
  }

  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;