import React from 'react';
import { LayoutDashboard, Users, Laptop, CalendarRange, LogOut } from 'lucide-react';
import { getLoggedUser } from '../utils/auth';

export default function Layout({ children, activeTab, setActiveTab, onLogout }) {
  const user = getLoggedUser() || { name: 'Usuario', email: 'correo@empresa.com', role: 'Colaborador' };
  
  const displayName = user.name || 'Usuario';
  const displayEmail = user.email || 'correo@empresa.com';
  const displayRole = user.role || 'Colaborador';
  const role = displayRole.toLowerCase();
  
  const displayRoleName = role === 'tecnico' ? 'Responsable de Tecnología' : displayRole;

  // Filtrar ítems de menú según el rol de los actores del sistema (Sección 5)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(role === 'admin' ? [{ id: 'usuarios', label: 'Usuarios', icon: Users }] : []),
    { id: 'equipos', label: 'Equipos', icon: Laptop },
    { id: 'prestamos', label: 'Préstamos', icon: CalendarRange },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        {/* Logo / Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <img
            src="/Img/Logo_Empresa.png"
            alt="TechAsset Logo"
            className="h-9 w-auto object-contain"
          />
          <div>
            <h1 className="text-lg font-bold tracking-wider m-0 text-white leading-none">TechAsset</h1>
            <span className="text-xs text-slate-400">Control de Activos</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>


      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 capitalize m-0">
            {activeTab === 'dashboard' ? 'Dashboard General' : activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 m-0">{displayName}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold uppercase">
                  {displayRoleName}
                </span>
                <p className="text-xs text-gray-500 m-0">{displayEmail}</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg border border-indigo-200">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
