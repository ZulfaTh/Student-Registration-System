import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Avatar, Box } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserEdit = () => {
  const { userId } = useParams();  // Get the userId from the URL
  console.log("Fetched User ID:", userId);

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    profilePicture: "",
    marks: {},
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else {
      console.error("User ID is missing from URL!");
      navigate("/");  // Redirect to home if userId is missing
    }
  }, [userId, navigate]);
  
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
     
      setUserData(response.data);     // For UserEdit
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleMarksChange = (e, subject) => {
    setUserData({
      ...userData,
      marks: {
        ...userData.marks,
        [subject]: e.target.value,
      },
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("age", userData.age);


    formData.append("marks", JSON.stringify(userData.marks));


    
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update successful:", response.data);
      navigate("/");
    } catch (error) {
      setError("Failed to update profile.");
      console.error("Update error:", error);
    }
  };

  return (
    <div style={{ margin: "30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper sx={{ padding: "20px", maxWidth: 800, width: "100%" }}>

      
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
          Edit Profile
        </Typography>

        {/* Profile Picture */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Avatar src={userData.profilePicture} sx={{ width: 100, height: 100, marginRight: "20px" }} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        {/* Input Fields */}
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={userData.age}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Marks Section */}
        <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: "20px" }}>
          Update Marks:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {userData.marks &&
            Object.keys(userData.marks).map((subject, index) => (
              <Box key={index} sx={{ width: "30%" }}>
                <TextField
                  label={subject.toUpperCase()}
                  value={userData.marks[subject]}
                  onChange={(e) => handleMarksChange(e, subject)}
                  variant="outlined"
                  fullWidth
                />
              </Box>
            ))}
        </Box>

        {/* Submit Button */}
        {error && (
          <Typography color="error" sx={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}
        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ padding: "10px 20px" }}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default UserEdit;
