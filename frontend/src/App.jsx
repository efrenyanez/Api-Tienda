import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Principal from "./pages/Home.jsx";
import CrearProducto from "./pages/CrearProducto.jsx";
import CrearProveedor from "./pages/CrearProveedor.jsx";
import LoginPage from "./pages/login.page.jsx";
import RegisterPage from "./pages/register.page.jsx";
import ProtectedRoute from "./components/protectedRoute";
//import TokenDebugger from "./components/TokenDebugger";



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
    <AuthProvider>
      {/* <TokenDebugger /> */}
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
          <Route 
            path="/crear-producto" 
            element={
              <ProtectedRoute requireCRUD={true}>
                <CrearProducto />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crear-proveedor" 
            element={
              <ProtectedRoute requireCRUD={true}>
                <CrearProveedor />
              </ProtectedRoute>
            } 
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
