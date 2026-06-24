import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Usuarios from './components/Usuarios';
import Equipos from './components/Equipos';
import Prestamos from './components/Prestamos';
import api from './services/api';
import { getLoggedUser } from './utils/auth';

function App() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token');
    if (!saved || saved === 'null' || saved === 'undefined') {
      localStorage.removeItem('token');
      return null;
    }
    return saved;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usuarios, setUsuarios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Proteger la pestaña 'usuarios' si el rol no es administrador
  useEffect(() => {
    if (token) {
      const user = getLoggedUser();
      const r = user?.role?.toLowerCase() || 'colaborador';
      if (r !== 'admin' && activeTab === 'usuarios') {
        setActiveTab('dashboard');
      }
    }
  }, [token, activeTab]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const user = getLoggedUser();
      const isStaff = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'tecnico';

      const promises = [
        api.get('/equipos'),
        api.get('/prestamos')
      ];

      if (isStaff) {
        promises.push(api.get('/usuarios'));
      }

      const results = await Promise.all(promises);

      setEquipos(results[0].data);
      setPrestamos(results[1].data);

      if (isStaff && results[2]) {
        setUsuarios(results[2].data);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No se pudo establecer conexión con el backend de la API.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuarios([]);
    setEquipos([]);
    setPrestamos([]);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <span className="text-sm font-semibold text-gray-500">Cargando información...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
          <div className="h-14 w-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            !
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Error de Conexión</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {error} Asegúrate de que el backend de ASP.NET Core esté en ejecución.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={fetchData}
              className="bg-indigo-650 hover:bg-indigo-750 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-650/15"
            >
              Reintentar Conexión
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard usuarios={usuarios} equipos={equipos} prestamos={prestamos} setActiveTab={setActiveTab} />;
      case 'usuarios':
        return <Usuarios usuarios={usuarios} onRefresh={fetchData} />;
      case 'equipos':
        return <Equipos equipos={equipos} onRefresh={fetchData} />;
      case 'prestamos':
        return <Prestamos prestamos={prestamos} usuarios={usuarios} equipos={equipos} onRefresh={fetchData} />;
      default:
        return <Dashboard usuarios={usuarios} equipos={equipos} prestamos={prestamos} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

export default App;
