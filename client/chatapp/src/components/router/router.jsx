import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
// import Home from "../../pages/home/home";
// import Register from "../../pages/register/register";
// import Info from "../../pages/info/info";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      {/* <Route path="home" element={<Home />} /> */}
      {/* <Route path="register" element={<Register />} />
      <Route path="info" element={<Info />} /> */}
    </Routes>
  );
}
