import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const Dashbords = () => {
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      <h1>Dashbords</h1>
      <Link to="/auth/login">Login</Link>
      <Outlet />
    </div>
  );
};

export default Dashbords;
  