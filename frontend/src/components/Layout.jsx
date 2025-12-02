import React, { useState, useEffect } from "react";

export default function Layout({ children, pageTitle, activePage }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);

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

  return (
    <div className="home-container">
      
      {/* PANEL LATERAL */}
      <div className={`side-panel ${isPanelOpen ? '' : 'hidden'}`}>
        <div className="panel-content">
          
          <nav className="panel-nav">
            <a 
              href="/" 
              className="panel-button"
              style={getButtonStyle('home')}
            >
              <span>🏠</span>
              <span>Home</span>
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
                </>
              )}
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