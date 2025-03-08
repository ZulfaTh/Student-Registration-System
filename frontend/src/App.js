import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserEdit from "./components/UserEdit";

function App() {
  const student = localStorage.getItem("token");

  return (
    <Routes>
      {student && <Route path="/" exact element={<Dashboard />} />}
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/useredit/:userId" element={<UserEdit />} />
    </Routes>
  );
}

export default App;
