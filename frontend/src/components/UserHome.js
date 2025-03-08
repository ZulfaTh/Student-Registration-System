import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

const UserHome = () => {
  const navigate = useNavigate();
  const [userFName, setUserFName] = useState("");
  const [userLName, setUserLName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userMarks, setUserMarks] = useState({});
  const [userDetails, setUserDetails] = useState("");

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      setUserDetails(response.data); // For UserHome
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserFName(decoded.firstName || "");
        setUserLName(decoded.lastName || "");
        setUserAge(decoded.age || "");
        setUserEmail(decoded.email || "");
        setUserRole(decoded.role || "");
        setUserProfilePicture(decoded.profilePicture || "");
        setUserMarks(decoded.marks);

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

  return (
    <div
      style={{
        margin: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          padding: "20px",
          maxWidth: 800,
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "16px",
          }}
        >
          {/* Profile Picture */}
          <Avatar
            src={userProfilePicture}
            alt="Profile"
            sx={{ width: 100, height: 100, marginRight: "20px" }}
          />
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {userFName} {userLName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {userEmail}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userAge} years old
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userRole}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ margin: "20px 0" }} />

        {/* Marks Section */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          Marks:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2, // Space between items
            justifyContent: "center",
          }}
        >
          {userMarks &&
            Object.keys(userMarks).map((subject, index) => (
              <Box key={index} sx={{ width: "30%" }}>
                {" "}
                
                <TextField
                  label={subject.toUpperCase()}
                  value={userMarks[subject] !== 0 ? userMarks[subject] : "00"}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true, 
                  }}
                />
              </Box>
            ))}
        </Box>

        {/* Edit Button */}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate(`/useredit/${userDetails._id}`)}
    sx={{ padding: "10px 20px", fontSize: "16px" }}
  >
    Edit Profile
  </Button>
</Box>
      </Paper>
    </div>
  );
};

export default UserHome;
