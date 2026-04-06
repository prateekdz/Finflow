import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import useFinflowStore from "../../store/useFinflowStore";

export function Layout({ title = 'Finflow', children }) {
  const sidebarCollapsed = useFinflowStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-screen bg-bg-main">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
          sidebarCollapsed ? 'sm:ml-[60px]' : 'sm:ml-[220px]'
        }`}
      >
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
