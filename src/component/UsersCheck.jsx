import { useState, useEffect } from "react";
import axios from "axios";

const UserCheck = ({ setData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const fetchProtectedData = async () => {
    try {
      // Fetching the main data
      const response = await axios.get("http://localhost:3000/", {
        withCredentials: true,
      });

      // Fetching user details
      const responseId = await axios.get(
        `http://localhost:3000/users/${response.data.userInfo.id}`,
        {
          withCredentials: true,
        }
      );

      // Update state
      setIsAuthenticated(responseId.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setData(null); // Set to null instead of empty string
      }
    }
  };

  useEffect(() => {
    // Fetch data only on component mount
    fetchProtectedData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Set data when isAuthenticated has updated
      setData(isAuthenticated);
    }
  }, [isAuthenticated, setData]);

  return null; // Since there's no UI to render
};

export default UserCheck;
