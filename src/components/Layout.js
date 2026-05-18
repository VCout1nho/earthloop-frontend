import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main style={{
        marginTop: '76px',
        padding: '2rem',
        minHeight: 'calc(100vh - 76px)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}>
        <Outlet />
      </main>
    </div>
  );
}