// src/components/RedirectByRole.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCheck } from "../config/FetchingData";
import Home from "../pages/home";

const RedirectByRole = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserCheck();
        if (userData?.role === "Admin") {
          setShouldRedirect(true);
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.log("Belum login:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/admin/home", { replace: true });
    }
  }, [shouldRedirect, navigate]);

  if (loading || shouldRedirect) return null;

  return <Home />;
};

export default RedirectByRole;
