import React, { useState, useMemo } from 'react';
import { CalendarRange, ShieldAlert, Undo2, Search } from 'lucide-react';
import api from '../services/api';
import { getLoggedUser } from '../utils/auth';

export default function Prestamos({ prestamos, usuarios, equipos, onRefresh }) {
  const currentUser = getLoggedUser();
  const isStaff = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'tecnico';
  const role = currentUser?.role?.toLowerCase() || 'colaborador';
  const isTecnico = role === 'tecnico';
  const showForm = role !== 'admin';

  const [form, setForm] = useState({ 
    usuarioId: isStaff ? '' : (currentUser?.id || ''), 
    equipoId: '', 
    fechaPrestamo: new Date().toISOString().split('T')[0], 
    observacion: '' 
  });
  const [returnForm, setReturnForm] = useState({ id: null, fechaDevolucion: new Date().toISOString().split('T')[0], observacion: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(false);

  const activeUsuarios = usuarios.filter(u => u.estado);
  const availableEquipos = equipos.filter(e => e.estado?.toLowerCase() === 'disponible');

  const userTotalLoansCount = useMemo(() => {
    if (isStaff) return prestamos.length;
    return prestamos.filter(p => p.usuarioId?.toLowerCase() === currentUser?.id?.toLowerCase()).length;
  }, [prestamos, isStaff, currentUser]);

  // Filtrado local para búsquedas y consultas
  const filteredPrestamos = useMemo(() => {
    return prestamos.filter(p => {
      // Si el usuario es Colaborador, solo ve sus propios préstamos
      if (!isStaff && p.usuarioId?.toLowerCase() !== currentUser?.id?.toLowerCase()) {
        return false;
      }

      const uName = p.usuario ? `${p.usuario.nombres} ${p.usuario.apellidos}`.toLowerCase() : '';
      const eqName = p.equipo ? p.equipo.nombre.toLowerCase() : '';
      const matchText = uName.includes(search.toLowerCase()) || eqName.includes(search.toLowerCase());
      
      const hasReturned = !!p.fechaDevolucion;
      let matchStatus = true;
      if (statusFilter === 'active') matchStatus = !hasReturned;
      else if (statusFilter === 'returned') matchStatus = hasReturned;

      const matchArea = areaFilter === '' || p.usuario?.area === areaFilter;

      return matchText && matchStatus && matchArea;
    });
  }, [prestamos, search, statusFilter, areaFilter, isStaff, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalUsuarioId = isStaff ? form.usuarioId : (currentUser?.id || '');

    if (!finalUsuarioId || !form.equipoId || !form.fechaPrestamo) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        usuarioId: finalUsuarioId
      };
      await api.post('/prestamos', payload);
      setForm({ 
        usuarioId: isStaff ? '' : (currentUser?.id || ''), 
        equipoId: '', 
        fechaPrestamo: new Date().toISOString().split('T')[0], 
        observacion: '' 
      });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el préstamo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role !== 'tecnico') {
      alert('Solo el Responsable de Tecnología puede registrar devoluciones.');
      return;
    }

    if (!returnForm.observacion.trim()) {
      setError('Debe ingresar observaciones para la devolución.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/prestamos/devolver', returnForm);
      setReturnForm({ id: null, fechaDevolucion: new Date().toISOString().split('T')[0], observacion: '' });
      setReturning(false);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la devolución.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={showForm ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "space-y-6"}>
      {/* Listado de Préstamos */}
      <div className={showForm ? "lg:col-span-2 space-y-6" : "space-y-6"}>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por colaborador o equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-1/2 md:w-36 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="returned">Devueltos</option>
            </select>
            {isStaff && (
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-1/2 md:w-40 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Todas las áreas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Marketing">Marketing</option>
                <option value="Logística">Logística</option>
              </select>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 m-0">Historial de Préstamos</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {filteredPrestamos.length} de {userTotalLoansCount} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3 border-b border-gray-100">Colaborador</th>
                  <th className="px-6 py-3 border-b border-gray-100">Equipo</th>
                  <th className="px-6 py-3 border-b border-gray-100">Préstamo</th>
                  <th className="px-6 py-3 border-b border-gray-100">Devolución</th>
                  <th className="px-6 py-3 border-b border-gray-100">Estado</th>
                  {role === 'tecnico' && <th className="px-6 py-3 border-b border-gray-100 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPrestamos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No se encontraron préstamos.
                    </td>
                  </tr>
                ) : (
                  filteredPrestamos.map((prestamo) => {
                    const hasReturned = !!prestamo.fechaDevolucion;
                    return (
                      <tr key={prestamo.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800 m-0">
                            {prestamo.usuario ? `${prestamo.usuario.nombres} ${prestamo.usuario.apellidos}` : 'Desconocido'}
                          </p>
                          <span className="text-xs text-gray-400">{prestamo.usuario?.area}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800 m-0">{prestamo.equipo?.nombre || 'Desconocido'}</p>
                          <span className="font-mono text-xs text-gray-400">{prestamo.equipo?.codigoPatrimonial}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {hasReturned ? new Date(prestamo.fechaDevolucion).toLocaleDateString('es-ES') : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            hasReturned
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {hasReturned ? 'Devuelto' : 'Activo'}
                          </span>
                        </td>
                        {isTecnico && (
                          <td className="px-6 py-4 text-right">
                            {!hasReturned && (
                              <button
                                onClick={() => {
                                  setError('');
                                  setReturnForm({ id: prestamo.id, fechaDevolucion: new Date().toISOString().split('T')[0], observacion: '' });
                                  setReturning(true);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Undo2 className="h-4 w-4" /> Devolver
                              </button>
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

      {/* Formulario de Creación / Devolución */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        {returning ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <Undo2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Devolver Equipo</h3>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="m-0 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fecha de Devolución</label>
                <input
                  type="date"
                  value={returnForm.fechaDevolucion}
                  onChange={(e) => setReturnForm({ ...returnForm, fechaDevolucion: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Observaciones de Entrega</label>
                <textarea
                  rows="3"
                  placeholder="Ej. El equipo se entrega limpio y sin desperfectos físicos..."
                  value={returnForm.observacion}
                  onChange={(e) => setReturnForm({ ...returnForm, observacion: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReturning(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  {loading ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <CalendarRange className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 m-0">
                {isStaff ? 'Registrar Préstamo' : 'Solicitar Préstamo'}
              </h3>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-sm mb-6 items-start">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="m-0 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Colaborador Responsable</label>
                {isStaff ? (
                  <select
                    value={form.usuarioId}
                    onChange={(e) => setForm({ ...form, usuarioId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Selecciona un colaborador...</option>
                    {activeUsuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} ({u.area})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={`${currentUser?.name || ''} (${currentUser?.area || 'Recursos Humanos'})`}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Equipo a Asignar</label>
                <select
                  value={form.equipoId}
                  onChange={(e) => setForm({ ...form, equipoId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">Selecciona un equipo disponible...</option>
                  {availableEquipos.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre} - {e.codigoPatrimonial}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fecha de Préstamo</label>
                <input
                  type="date"
                  value={form.fechaPrestamo}
                  onChange={(e) => setForm({ ...form, fechaPrestamo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Observaciones Iniciales</label>
                <textarea
                  rows="3"
                  placeholder={isStaff ? 'Ej. Se entrega con cargador y maletín, sin golpes...' : 'Ej. Necesito el equipo para trabajo en campo esta semana...'}
                  value={form.observacion}
                  onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm mt-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {loading ? 'Procesando...' : (isStaff ? 'Registrar Préstamo' : 'Solicitar Préstamo')}
              </button>
            </form>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
