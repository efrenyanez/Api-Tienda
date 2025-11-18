import React from "react";
import { Home, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function SlideBar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition"
        >
          <Home size={20} /> Home
        </Link>
        <Link
          to="/crear-producto"
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition"
        >
          <Package size={20} /> Crear Producto
        </Link>
        <Link
          to="/crear-proveedor"
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition"
        >
          <Truck size={20} /> Crear Proveedor
        </Link>
      </nav>
    </div>
  );
}
