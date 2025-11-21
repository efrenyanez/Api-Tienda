import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./pages/Home.jsx";
import CrearProducto from "./pages/CrearProducto.jsx";
import CrearProveedor from "./pages/CrearProveedor.jsx";
import LoginPage from "./pages/login.page.jsx";
import RegisterPage from "./pages/register.page.jsx";
import ProtectedRoute from "./components/protectedRoute";



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
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
