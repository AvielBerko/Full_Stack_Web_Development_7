import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/login";
// import Home from "../../pages/home/home";
import Register from "../pages/Register/register";
import Profile from "../pages/Profile/profile";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      {/* <Route path="home" element={<Home />} /> */}
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}