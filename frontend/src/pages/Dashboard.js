import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import UserHome from "../components/UserHome";
import TeacherHome from "../components/TeacherHome";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userFName, setUserFName] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.error("Token expired");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUserFName(decoded.firstName || "Guest");
        setUserRole(decoded.role || "user");

        if (decoded._id) {
          fetchUserDetails(decoded._id);
        } else {
          console.error("User ID missing from token!");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#4da5f7" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ marginLeft: "20px", color: "white" ,fontFamily:"Monaco"}}>
            Hello, {userFName} 
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: "white",
              color: "#4da5f7",
              borderRadius: "20px",
              width: "120px",
              fontWeight: "bold",
              marginRight: "20px",
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conditional Rendering based on role */}
      {userRole === "teacher" ? (
        <TeacherHome />
      ) : loading ? (
        <Typography>Loading user details...</Typography>
      ) : (
        <UserHome userDetails={userDetails} />
      )}
    </div>
  );
};

export default Dashboard;
