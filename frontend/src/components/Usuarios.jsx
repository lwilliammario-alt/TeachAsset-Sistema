import React, { useState, useMemo } from 'react';
import { UserPlus, ToggleLeft, ToggleRight, Check, X, ShieldAlert, Edit, Search } from 'lucide-react';
import api from '../services/api';
import { getLoggedUser } from '../utils/auth';

export default function Usuarios({ usuarios, onRefresh }) {
  const currentUser = getLoggedUser();
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const [form, setForm] = useState({ nombres: '', apellidos: '', correo: '', area: '', rol: 'Colaborador' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombres: '', apellidos: '', correo: '', area: '', rol: 'Colaborador' });
  
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtrado local para búsquedas y consultas
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(u => {
      const matchText = `${u.nombres} ${u.apellidos} ${u.correo}`.toLowerCase().includes(search.toLowerCase());
      const matchArea = areaFilter === '' || u.area === areaFilter;
      return matchText && matchArea;
    });
  }, [usuarios, search, areaFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.correo.trim() || !form.area.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/usuarios', form);
      setForm({ nombres: '', apellidos: '', correo: '', area: '', rol: 'Colaborador' });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editForm.nombres.trim() || !editForm.apellidos.trim() || !editForm.correo.trim() || !editForm.area.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/usuarios/${editingId}`, editForm);
      setEditingId(null);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id) => {
    if (!isAdmin) {
      alert('Solo el Administrador podrá deshabilitar usuarios (RN-09).');
      return;
    }
    try {
      await api.patch(`/usuarios/${id}/toggle-estado`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar estado del usuario.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Listado de Usuarios */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="">Todas las áreas</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Marketing">Marketing</option>
            <option value="Logística">Logística</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 m-0">Colaboradores Registrados</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {filteredUsuarios.length} de {usuarios.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3 border-b border-gray-100">Nombre</th>
                  <th className="px-6 py-3 border-b border-gray-100">Correo</th>
                  <th className="px-6 py-3 border-b border-gray-100">Área</th>
                  <th className="px-6 py-3 border-b border-gray-100">Rol</th>
                  <th className="px-6 py-3 border-b border-gray-100">Estado</th>
                  <th className="px-6 py-3 border-b border-gray-100 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No se encontraron colaboradores.
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {usuario.nombres} {usuario.apellidos}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{usuario.correo}</td>
                      <td className="px-6 py-4 text-gray-600">{usuario.area}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          usuario.estado
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {usuario.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setEditingId(usuario.id);
                              setEditForm({
                                nombres: usuario.nombres,
                                apellidos: usuario.apellidos,
                                correo: usuario.correo,
                                area: usuario.area,
                                rol: usuario.rol || 'Colaborador'
                              });
                            }}
                            title="Editar Datos"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all inline-flex shadow-sm"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleEstado(usuario.id)}
                          disabled={!isAdmin}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                            usuario.estado
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 disabled:opacity-50'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 disabled:opacity-50'
                          }`}
                        >
                          {usuario.estado ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Formulario de Creación / Edición */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        {editingId ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <Edit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Editar Colaborador</h3>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="m-0 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombres</label>
                <input
                  type="text"
                  value={editForm.nombres}
                  onChange={(e) => setEditForm({ ...editForm, nombres: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Apellidos</label>
                <input
                  type="text"
                  value={editForm.apellidos}
                  onChange={(e) => setEditForm({ ...editForm, apellidos: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo</label>
                <input
                  type="email"
                  value={editForm.correo}
                  onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Área</label>
                <select
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="Tecnología">Tecnología</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Logística">Logística</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rol</label>
                <select
                  value={editForm.rol}
                  onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="Admin">Admin</option>
                  <option value="Tecnico">Técnico</option>
                  <option value="Colaborador">Colaborador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/10 focus:outline-none"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <UserPlus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Registrar Colaborador</h3>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="m-0 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombres</label>
                <input
                  type="text"
                  placeholder="Ej. Juan Alberto"
                  value={form.nombres}
                  onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Apellidos</label>
                <input
                  type="text"
                  placeholder="Ej. Pérez Gómez"
                  value={form.apellidos}
                  onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="juan.perez@empresa.com"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Área / Departamento</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">Selecciona un área...</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Logística">Logística</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-semibold py-3 rounded-xl text-sm mt-2 transition-all shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {loading ? 'Registrando...' : 'Registrar Colaborador'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
