import { Route, Routes, Navigate } from "react-router-dom";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

function App() {
	const student = localStorage.getItem("token");

	return (
		<Routes>
			 {student && <Route path="/" exact element={<Dashboard/>} />}
			<Route path="/signup" exact element={<SignUp />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

export default App;