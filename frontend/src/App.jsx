import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CrearProducto from "./pages/CrearProducto.jsx";
import CrearProveedor from "./pages/CrearProveedor.jsx";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear-producto" element={<CrearProducto />} />
        <Route path="/crear-proveedor" element={<CrearProveedor />} />
      </Routes>
    </Router>
  );
}
