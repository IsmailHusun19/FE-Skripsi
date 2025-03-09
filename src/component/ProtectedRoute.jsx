import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("status"));

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
