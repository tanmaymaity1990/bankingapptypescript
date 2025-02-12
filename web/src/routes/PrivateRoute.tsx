import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element | null => {
  const token = localStorage.getItem("token");

  return token ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
