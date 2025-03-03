import { Route, Routes, Navigate } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Main from "./components/Main";

function App() {
	const student = localStorage.getItem("token");

	return (
		<Routes>
			 {student && <Route path="/" exact element={<Main/>} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

export default App;