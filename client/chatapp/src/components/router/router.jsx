import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import Profile from "../pages/Profile/profile";
import DirectMessaging from "../pages/DirectMessaging/direct-messaging";
import GroupMessaging from "../pages/GroupMessaging/group-messaging";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path=":name">
        <Route path="profile" element={<Profile />} />
        <Route path="contacts" element={<DirectMessaging />} />
        <Route path="groups" element={<GroupMessaging />} />
      </Route>
    </Routes>
  );
}
