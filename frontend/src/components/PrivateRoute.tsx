import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute:React.FC = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.log("No token found! Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
