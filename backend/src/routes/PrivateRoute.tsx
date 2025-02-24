import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("jwtToken");
  
  if(token){
    return <Outlet />;
};
return <Navigate to="/login" />;
}

export default PrivateRoute;
