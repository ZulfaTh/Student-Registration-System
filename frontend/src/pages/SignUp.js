import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { TextField, Button, Grid, Typography, Snackbar, Alert, Box } from "@mui/material";

const SignUp = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleChange = ({ target: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/students";
            const { data: res } = await axios.post(url, data);
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
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
            <Grid container sx={{ width: "900px", boxShadow: 3, borderRadius: 3, overflow: "hidden" }}>
                <Grid item xs={4} sx={{ backgroundColor: "#3bb19b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h4" color="white">Welcome Back</Typography>
                    <Link to="/login">
                        <Button variant="outlined" sx={{ mt: 2, color: "white", borderColor: "white" }}>Sign In</Button>
                    </Link>
                </Grid>
                <Grid item xs={8} sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4 }}>
                    <Typography variant="h4" gutterBottom>Create Account</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="First Name" name="firstName" value={data.firstName} onChange={handleChange} required sx={{ mb: 2 }} />
                        <TextField fullWidth label="Last Name" name="lastName" value={data.lastName} onChange={handleChange} required sx={{ mb: 2 }} />
                        <TextField fullWidth label="Age" type="number" name="age" value={data.age} onChange={handleChange} required sx={{ mb: 2 }} />
                        <TextField fullWidth label="Email" type="email" name="email" value={data.email} onChange={handleChange} required sx={{ mb: 2 }} />
                        <TextField fullWidth label="Password" type="password" name="password" value={data.password} onChange={handleChange} required sx={{ mb: 2 }} />
                        
                        <Button fullWidth variant="contained" color="primary" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </Grid>
            </Grid>

            {/* Snackbar for Error Messages */}
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert severity="error" onClose={handleClose}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default SignUp;
