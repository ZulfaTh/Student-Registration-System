import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      navigate("/");
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        component={Paper}
        sx={{ borderRadius: "10px", boxShadow: 3 }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Typography variant="h4" align="center" sx={{ fontFamily: "Copperplate" }}>
  Login to Your Account
</Typography>


            <TextField
              label="Email"
              type="email"
              name="email"
              onChange={handleChange}
              value={data.email}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              value={data.password}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />

            {error && (
              <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              Sign In
            </Button>
          </form>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#4da5f7",
            padding: 3,
          }}
        >
          <Typography variant="h4" color="white" align="center" sx={{ fontFamily: "Lucida Handwriting" }}>
            New Here?
          </Typography>
          <Link to="/signup" style={{ textDecoration: "none" }}>
          <Button
              variant="outlined"
              sx={{ mt: 2, color: "blue", borderColor: "blue" ,fontFamily: "Copperplate"  }}
            >
              Sign Up
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
