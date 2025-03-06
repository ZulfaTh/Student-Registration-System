import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUserName(decoded.firstName);
                setUserRole(decoded.role); // Set the role from token
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                navigate("/login"); // Redirect to login if token is invalid
            }
        } else {
            navigate("/login"); // Redirect to login if no token found
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#3bb19b" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ marginLeft: "20px", color: "white" }}>
                    Welcome, {userName ? userName : "Guest"} ({userRole})
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: "white",
                        color: "#3bb19b",
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
    );
};

export default Dashboard;
