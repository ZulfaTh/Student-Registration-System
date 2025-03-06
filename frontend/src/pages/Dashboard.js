import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<AppBar position="static" sx={{ backgroundColor: "#3bb19b" }}>
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<Typography variant="h5" sx={{ marginLeft: "20px", color: "white" }}>
					Student Registration System
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
