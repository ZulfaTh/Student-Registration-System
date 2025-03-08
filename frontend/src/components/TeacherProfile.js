import React, { useState, useEffect } from "react";
import { Card, CardContent, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";


const TeacherProfile = () => {
  const navigate = useNavigate();
  const [userFName, setUserFName] = useState("");
  const [userLName, setUserLName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserFName(decoded.firstName || "");
        setUserLName(decoded.lastName || "");
        setUserEmail(decoded.email || "");
        setUserRole(decoded.role || "");
        setUserProfilePicture(decoded.profilePicture || "");
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "30px",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: "20px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <Avatar
          src={userProfilePicture}
          alt="Profile"
          sx={{ width: 100, height: 100, margin: "auto" }}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {userFName} {userLName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {userEmail}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userRole}
          </Typography>
        </CardContent>
      </Card>

  
    </div>
  );
};

export default TeacherProfile;
