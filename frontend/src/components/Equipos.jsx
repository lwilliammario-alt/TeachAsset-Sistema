import React, { useState, useMemo } from 'react';
import { Laptop, CheckCircle, Ban, Wrench, ShieldAlert, Edit, Search } from 'lucide-react';
import api from '../services/api';
import { getLoggedUser } from '../utils/auth';

export default function Equipos({ equipos, onRefresh }) {
  const currentUser = getLoggedUser();
  const isStaff = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'tecnico';
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const [form, setForm] = useState({ codigoPatrimonial: '', nombre: '', categoria: '', marca: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', categoria: '', marca: '', estado: '' });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtrado local para búsquedas y consultas
  const filteredEquipos = useMemo(() => {
    return equipos.filter(e => {
      const matchText = `${e.nombre} ${e.codigoPatrimonial} ${e.marca}`.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === '' || e.categoria === categoryFilter;
      const matchStatus = statusFilter === '' || e.estado === statusFilter;
      return matchText && matchCategory && matchStatus;
    });
  }, [equipos, search, categoryFilter, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isStaff) {
      alert('Solo el Administrador o Responsable de Tecnología pueden registrar equipos.');
      return;
    }

    if (!form.codigoPatrimonial.trim() || !form.nombre.trim() || !form.categoria.trim() || !form.marca.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/equipos', form);
      setForm({ codigoPatrimonial: '', nombre: '', categoria: '', marca: '' });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el equipo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isStaff) {
      alert('Solo el Administrador o Responsable de Tecnología pueden editar equipos.');
      return;
    }

    if (!editForm.nombre.trim() || !editForm.categoria.trim() || !editForm.marca.trim() || !editForm.estado.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/equipos/${editingId}`, editForm);
      setEditingId(null);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el equipo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (id, nuevoEstado) => {
    if (!isStaff) {
      alert('Acción restringida para tu rol.');
      return;
    }
    try {
      await api.patch(`/equipos/${id}/estado`, JSON.stringify(nuevoEstado), {
        headers: { 'Content-Type': 'application/json' }
      });
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar estado.');
    }
  };

  return (
    <div className={isStaff ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : 'space-y-6'}>

      {/* ── Listado de Equipos ── */}
      <div className={isStaff ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>

        {/* Search + Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-1/2 md:w-40 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Categorías</option>
              <option value="Laptops">Laptops</option>
              <option value="Computadoras de escritorio">Computadoras</option>
              <option value="Monitores">Monitores</option>
              <option value="Impresoras">Impresoras</option>
              <option value="Tablets">Tablets</option>
              <option value="Proyectores multimedia">Proyectores</option>
              <option value="Equipos de red">Equipos Red</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-1/2 md:w-40 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 m-0">Inventario de Equipos</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {filteredEquipos.length} de {equipos.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3 border-b border-gray-100">Código</th>
                  <th className="px-6 py-3 border-b border-gray-100">Equipo</th>
                  <th className="px-6 py-3 border-b border-gray-100">Categoría</th>
                  <th className="px-6 py-3 border-b border-gray-100">Marca</th>
                  <th className="px-6 py-3 border-b border-gray-100">Estado</th>
                  {isAdmin && <th className="px-6 py-3 border-b border-gray-100 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredEquipos.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-400">
                      No se encontraron equipos en el inventario.
                    </td>
                  </tr>
                ) : (
                  filteredEquipos.map((equipo) => {
                    let badgeColor = 'bg-gray-50 text-gray-600 border-gray-100';
                    if (equipo.estado?.toLowerCase() === 'disponible') {
                      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    } else if (equipo.estado?.toLowerCase() === 'prestado') {
                      badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
                    } else if (equipo.estado?.toLowerCase() === 'mantenimiento') {
                      badgeColor = 'bg-rose-50 text-rose-600 border-rose-100';
                    } else if (equipo.estado?.toLowerCase() === 'baja') {
                      badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                    }

                    return (
                      <tr key={equipo.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{equipo.codigoPatrimonial}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{equipo.nombre}</td>
                        <td className="px-6 py-4 text-gray-600">{equipo.categoria}</td>
                        <td className="px-6 py-4 text-gray-600">{equipo.marca}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                            {equipo.estado}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right space-x-1">
                            {equipo.estado?.toLowerCase() !== 'prestado' && (
                              <button
                                onClick={() => {
                                  setEditingId(equipo.id);
                                  setEditForm({
                                    nombre: equipo.nombre,
                                    categoria: equipo.categoria,
                                    marca: equipo.marca,
                                    estado: equipo.estado || 'Disponible'
                                  });
                                }}
                                title="Editar Detalles"
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all inline-flex shadow-sm"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {equipo.estado?.toLowerCase() !== 'prestado' && (
                              <>
                                {equipo.estado?.toLowerCase() !== 'disponible' && (
                                  <button
                                    onClick={() => handleUpdateEstado(equipo.id, 'Disponible')}
                                    title="Marcar como Disponible"
                                    className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all inline-flex"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                {equipo.estado?.toLowerCase() !== 'mantenimiento' && (
                                  <button
                                    onClick={() => handleUpdateEstado(equipo.id, 'Mantenimiento')}
                                    title="Enviar a Mantenimiento"
                                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all inline-flex"
                                  >
                                    <Wrench className="h-4 w-4" />
                                  </button>
                                )}
                                {equipo.estado?.toLowerCase() !== 'baja' && (
                                  <button
                                    onClick={() => handleUpdateEstado(equipo.id, 'Baja')}
                                    title="Dar de Baja"
                                    className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all inline-flex"
                                  >
                                    <Ban className="h-4 w-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Formulario de Creación / Edición (solo staff) ── */}
      {isStaff && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          {(editingId && isAdmin) ? (
            /* EDIT FORM */
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                  <Edit className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 m-0">Editar Equipo</h3>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="m-0 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre del Equipo</label>
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Categoría</label>
                  <select
                    value={editForm.categoria}
                    onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Computadoras de escritorio">Computadoras de escritorio</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Impresoras">Impresoras</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Proyectores multimedia">Proyectores multimedia</option>
                    <option value="Equipos de red">Equipos de red</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Marca</label>
                  <input
                    type="text"
                    value={editForm.marca}
                    onChange={(e) => setEditForm({ ...editForm, marca: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado</label>
                  <select
                    value={editForm.estado}
                    onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Baja">Baja</option>
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
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/10 focus:outline-none"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* CREATE FORM */
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                  <Laptop className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 m-0">Registrar Equipo</h3>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="m-0 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Código Patrimonial</label>
                  <input
                    type="text"
                    placeholder="Ej. CP-001"
                    value={form.codigoPatrimonial}
                    onChange={(e) => setForm({ ...form, codigoPatrimonial: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre del Equipo</label>
                  <input
                    type="text"
                    placeholder="Ej. Laptop ThinkPad L14"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Selecciona una categoría...</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Computadoras de escritorio">Computadoras de escritorio</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Impresoras">Impresoras</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Proyectores multimedia">Proyectores multimedia</option>
                    <option value="Equipos de red">Equipos de red</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Marca</label>
                  <input
                    type="text"
                    placeholder="Ej. Lenovo, HP, Dell"
                    value={form.marca}
                    onChange={(e) => setForm({ ...form, marca: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm mt-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  {loading ? 'Registrando...' : 'Registrar Equipo'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
