import { Navigate, useNavigate } from "react-router-dom";
import { getUserCheck } from "../config/FetchingData";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = JSON.parse(localStorage.getItem("status"));
  const navigate = useNavigate();

  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      setUserRole(dataUser.role);
    } catch (error) {
      return <Navigate to="/" replace />;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getDataUser();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if(userRole === null){
      return <Navigate to="/" replace />;
    }else{
      return <Navigate to="/error" replace />;
    }
    console.log(userRole)
  }

  return children;
};

export default ProtectedRoute;
