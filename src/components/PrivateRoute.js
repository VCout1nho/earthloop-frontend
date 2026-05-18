import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Salva a rota que o usuário tentou acessar para redirecionar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}