import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isAuthenticated }) {
  // Verificar tanto el estado como el localStorage para mantener persistencia
  const storedAuth = localStorage.getItem("isAuthenticated");
  const isUserAuthenticated = isAuthenticated || storedAuth === "true";

  if (!isUserAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
}
