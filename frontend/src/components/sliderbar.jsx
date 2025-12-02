import React, { useEffect, useState } from "react";
import { Home, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";


export default function SlideBar() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Obtener el rol del usuario del localStorage
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Determinar si el usuario puede crear (admin o gerente)
  const canCreate = userRole === 'admin' || userRole === 'gerente';
  return (
    <div className="side-panel">
      <div className="panel-content">
        <h2 className="panel-title">Panel de Control</h2>
        <nav className="panel-nav">
          <Link
            to="/principal"
            className="panel-button"
          >
            <Home size={20} /> 
            <span>Home</span>
          </Link>
          {/* Los botones de crear solo se muestran para admin y gerente */}
          {canCreate && (
            <>
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
            </>
          )}
        </nav>

        
      </div>
    </div>
  );
}