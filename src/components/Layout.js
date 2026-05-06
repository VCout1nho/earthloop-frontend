// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-layout flex min-h-screen w-full">
      <Sidebar />

      <main 
  className="flex-1"
  style={{
    marginLeft: 'var(--sidebar-width)',
    transition: 'margin-left 0.4s ease',
    background: 'var(--bg-primary)',
    minHeight: '100vh',
    padding: '2rem',
  }}
>
  <Outlet />
</main>
    </div>
  );
}