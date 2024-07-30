import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AuthGuard = () => {
  const { user } = useAuthStore();

  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default AuthGuard;
