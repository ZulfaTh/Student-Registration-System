import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    adminCode: "", 
  });
  const [isTeacher, setIsTeacher] = useState(false); 
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = ({ target: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set role based on whether the user is a teacher or student
    const userRole = isTeacher ? "teacher" : "student";

    // Prepare the data object to include the role
    let userData = {
      ...data,
      role: userRole, 
    };

    // Remove age for teachers, as they don't need it
    if (isTeacher) {
      delete userData.age;
    }


    if (!isTeacher) {
      delete userData.adminCode;  
    }
    
      // Validate age for students
    if (!isTeacher) { 
        const ageInt = parseInt(data.age, 10); // Convert age to integer
        if (isNaN(ageInt) || ageInt <= 18) {
            setError("Age must be greater than 18 to register as a student.");
            setOpen(true);
            return;
        }
    }

    // Admin Code validation for teachers
    if (isTeacher && data.adminCode !== "12345") {
      setError("Invalid admin code.");
      setOpen(true);
      return;
    }

    console.log("Sending data:", userData); 
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, userData);
      console.log(res.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        setOpen(true);
      } else {
        setError("Something went wrong!");
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Grid
        container
        sx={{
          width: "900px",
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Grid
          item
          xs={4}
          sx={{
            backgroundColor: "#4da5f7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="white" sx={{ fontFamily: "Lucida Handwriting" }}>
            Welcome Back
          </Typography>
          <Link to="/login">
            <Button
              variant="outlined"
              sx={{ mt: 2, color: "blue", borderColor: "blue" ,fontFamily: "Copperplate"  }}
            >
              Sign In
            </Button>
          </Link>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: "Copperplate" }}>
            CREATE ACCOUNT
          </Typography>
<br/>
       
<div style={{ display: "flex", gap: "10px" }}>
  <Button
    variant={isTeacher ? "outlined" : "contained"} // Change variant based on state
    onClick={() => setIsTeacher(false)}
    sx={{
      mb: 2,
      width: "200px",
      backgroundColor: isTeacher ? "white" : "#4da5f7", // Green when selected
      color: isTeacher ? "#4da5f7" : "white", // Text color
      "&:hover": {
        backgroundColor: "#123f69", // Hover effect
        color: "white",
      },
    }}
  >
    Register as Student
  </Button>

  <Button
    variant={isTeacher ? "contained" : "outlined"} // Change variant based on state
    onClick={() => setIsTeacher(true)}
    sx={{
      mb: 2,
      width: "200px",
      backgroundColor: isTeacher ? "#4da5f7" : "white", // Green when selected
      color: isTeacher ? "white" : "#4da5f7",
      "&:hover": {
        backgroundColor: "#123f69", // Hover effect
        color: "white",
      },
    }}
  >
    Register as Teacher
  </Button>
</div>


          {/* Form fields */}
          <form onSubmit={handleSubmit}>
           
            {isTeacher && (
              <TextField
                fullWidth
                label="Admin Code"
                type="text"
                name="adminCode"
                value={data.adminCode}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            {/* Conditionally render age for students */}
            {!isTeacher && (
              <TextField
                fullWidth
                label="Age"
                type="number"
                name="age"
                value={data.age}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
           
              />
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <Button fullWidth variant="contained" color="primary" type="submit">
              Sign Up
            </Button>
          </form>
        </Grid>
      </Grid>

      {/* Snackbar for Error Messages */}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
