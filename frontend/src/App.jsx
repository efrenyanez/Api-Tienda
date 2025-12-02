import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./pages/Home.jsx";
import CrearProducto from "./pages/CrearProducto.jsx";
import CrearProveedor from "./pages/CrearProveedor.jsx";
import LoginPage from "./pages/login.page.jsx";
import RegisterPage from "./pages/register.page.jsx";
import ProtectedRoute from "./components/protectedRoute";



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  //variable para guardar el rol del usuario
  const [userRole, setUserRole] = React.useState(null);

  // Recuperar la sesión del localStorage cuando la app se carga
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserRole = localStorage.getItem("userRole");
    
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      if (storedUserRole) {
        setUserRole(storedUserRole);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route
          path="/principal"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Principal />
            </ProtectedRoute>
          }
        />
        <Route path="/crear-producto" element={<CrearProducto />} />
        <Route path="/crear-proveedor" element={<CrearProveedor />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}
