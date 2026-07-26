import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const UserCheck = ({ setData }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/`, {
        withCredentials: true,
      });

      // Fetching user details
      const responseId = await axios.get(
        `${BASE_URL}/users/${response.data.userInfo.id}`,
        {
          withCredentials: true,
        }
      );

      // Update state
      setIsAuthenticated(responseId.data);
      localStorage.setItem("status", true);
    } catch (error) {
      console.error("Error fetching protected data:", error);
      localStorage.setItem("status", false);
      navigate('/')
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setData(null);
      }
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setData(isAuthenticated);
    }
  }, [isAuthenticated, setData]);

  return null;
};

export default UserCheck;
