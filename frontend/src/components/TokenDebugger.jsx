/* import React from 'react';
import { useAuth } from '../context/AuthContext';

const TokenDebugger = () => {
  const { debugToken, logout, user, token } = useAuth();

  const handleDebugClick = () => {
    debugToken();
  };

  const handleForceLogout = () => {
    console.log('🔄 Forzando logout manual');
    logout();
  };

  const clearAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!user) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: '#f8f9fa', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: 1000
      }}>
        <h4>🔍 Token Debugger</h4>
        <p>No hay usuario autenticado</p>
        <button onClick={clearAndReload}>Limpiar localStorage</button>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f8f9fa', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>🔍 Token Debugger</h4>
      <p><strong>Usuario:</strong> {user.correo}</p>
      <p><strong>Rol:</strong> {user.rol}</p>
      <p><strong>Token existe:</strong> {token ? '✅ Sí' : '❌ No'}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button onClick={handleDebugClick} style={{ padding: '5px' }}>
          Ver info del token
        </button>
        <button onClick={handleForceLogout} style={{ padding: '5px', background: '#dc3545', color: 'white' }}>
          Forzar logout
        </button>
        <button onClick={clearAndReload} style={{ padding: '5px', background: '#6c757d', color: 'white' }}>
          Limpiar todo y recargar
        </button>
      </div>
      
      <div style={{ fontSize: '11px', marginTop: '10px', color: '#666' }}>
        💡 Abre la consola (F12) para ver los logs del token
      </div>
    </div>
  );
};

export default TokenDebugger; */