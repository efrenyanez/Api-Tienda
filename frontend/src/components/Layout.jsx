import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children, pageTitle, activePage }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el rol del usuario del localStorage
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const getButtonStyle = (page) => {
    return page === activePage ? { background: '#3b82f6' } : {};
  };

  // Determinar si el usuario puede crear (admin o gerente)
  const canCreate = userRole === 'admin' || userRole === 'gerente';

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    
    // Redirigir al login
    navigate("/");
  };

  return (
    <div className="home-container">
      
      {/* PANEL LATERAL */}
      <div className={`side-panel ${isPanelOpen ? '' : 'hidden'}`}>
        <div className="panel-content">
          
          <nav className="panel-nav">
            <a 
              href="/principal" 
              className="panel-button"
              style={getButtonStyle('home')}
            >
              <span>🏠</span>
              <span>Home</span>
            </a>
            
            <a 
              href="/buscador" 
              className="panel-button"
              style={getButtonStyle('search')}
            >
              <span>🔍</span>
              <span>Buscador</span>
            </a>
            
          </nav>

          
        </div>
      </div>

      <div className={`main-content ${isPanelOpen ? 'with-panel' : ''}`}>
        
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              
              
              <h1 className="header-title">{pageTitle}</h1>
            </div>

            <div className="header-buttons">
              {/* Los botones de crear solo se muestran para admin y gerente */}
              {canCreate && (
                <>
                  <a 
                    href="/crear-producto" 
                    className={`header-btn ${activePage === 'producto' ? 'active' : ''}`}
                  >
                    <span>📦</span>
                    <span>Crear Producto</span>
                  </a>
                  <a 
                    href="/crear-proveedor" 
                    className={`header-btn ${activePage === 'proveedor' ? 'active' : ''}`}
                  >
                    <span>🏢</span>
                    <span>Crear Proveedor</span>
                  </a>
                  <a 
                    href="/usuarios" 
                    className={`header-btn ${activePage === 'proveedor' ? 'active' : ''}`}
                  >
                    <span>Usuarios</span>
                  </a>
                </>
              )}
              
              {/* Botón de cerrar sesión */}
              <button 
                onClick={handleLogout}
                className="header-btn logout-btn"
                title="Cerrar sesión"
              >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}