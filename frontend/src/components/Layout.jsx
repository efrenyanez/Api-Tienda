import React, { useState } from "react";

export default function Layout({ children, pageTitle, activePage }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const getButtonStyle = (page) => {
    return page === activePage ? { background: '#3b82f6' } : {};
  };

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