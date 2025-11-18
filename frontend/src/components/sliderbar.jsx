import React from "react";
import { Home, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";


export default function SlideBar() {
  return (
    <div className="side-panel">
      <div className="panel-content">
        <h2 className="panel-title">Panel de Control</h2>
        <nav className="panel-nav">
          <Link
            to="/"
            className="panel-button"
          >
            <Home size={20} /> 
            <span>Home</span>
          </Link>
          <Link
            to="/crear-producto"
            className="panel-button"
          >
            <Package size={20} /> 
            <span>Crear Producto</span>
          </Link>
          <Link
            to="/crear-proveedor"
            className="panel-button"
          >
            <Truck size={20} /> 
            <span>Crear Proveedor</span>
          </Link>
        </nav>

        
      </div>
    </div>
  );
}