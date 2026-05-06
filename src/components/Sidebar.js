import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaMapMarkedAlt, FaStore, FaRobot, FaBullhorn, FaHeadset, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/painel", icon: <FaChartBar /> },
    { name: "Mapa", path: "/mapa", icon: <FaMapMarkedAlt /> },
    { name: "Loja", path: "/mercado", icon: <FaStore /> },
    { name: "Análise", path: "/ai", icon: <FaRobot /> },
    { name: "Anuncie", path: "/anuncie", icon: <FaBullhorn /> },
    { name: "Contato", path: "/suporte", icon: <FaHeadset /> },
  ];

  const authItems = [
    { name: "Crie sua conta", path: "/cadastro", icon: <FaUserPlus /> },
    { name: "Entre", path: "/login", icon: <FaSignInAlt /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '76px',
      background: '#2e7d32',           // Verde sustentável
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      gap: '2.5rem',
      color: 'white',
    }}>

      {/* Logo + Nome EarthLoop */}
      <div 
        onClick={() => navigate('/')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '1.75rem',
        }}
      >
        <img 
          src="/logo.png" 
          alt="EarthLoop Logo" 
          style={{ 
            height: '48px', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
        <span>EarthLoop</span>
      </div>

      {/* Menu Principal */}
      <nav style={{ 
        display: 'flex', 
        gap: '6px', 
        flex: 1 
      }}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '12px 20px',
              borderRadius: '999px',
              background: isActive(item.path) ? 'white' : 'transparent',
              color: isActive(item.path) ? '#2e7d32' : 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              fontSize: '1.05rem',
            }}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </nav>

      {/* Botões de Autenticação (direita) */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {authItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '11px 22px',
              borderRadius: '999px',
              background: 'white',
              color: '#2e7d32',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </div>

    </header>
  );
}