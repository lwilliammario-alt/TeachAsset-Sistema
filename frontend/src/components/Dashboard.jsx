import React, { useMemo } from 'react';
import { Laptop, CheckCircle, AlertTriangle, CalendarRange, MapPin, Award, ArrowRight, UserCheck, Wrench, RefreshCw } from 'lucide-react';
import { getLoggedUser } from '../utils/auth';

export default function Dashboard({ usuarios, equipos, prestamos, setActiveTab }) {
  const currentUser = getLoggedUser();
  const role = currentUser?.role?.toLowerCase() || 'colaborador';
  const displayName = currentUser?.name || 'Usuario';

  // 1. Métricas para Administrador y Técnico (Globales)
  const globalMetrics = useMemo(() => {
    const totalEquipos = equipos.length;
    const disponibles = equipos.filter(e => e.estado?.toLowerCase() === 'disponible').length;
    const prestados = equipos.filter(e => e.estado?.toLowerCase() === 'prestado').length;
    const mantenimiento = equipos.filter(e => e.estado?.toLowerCase() === 'mantenimiento').length;
    const totalPrestamos = prestamos.length;

    // Calcular área con mayor uso
    const areaCounts = {};
    prestamos.forEach(p => {
      const area = p.usuario?.area || 'Desconocido';
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });

    let topArea = 'Ninguna';
    let maxCount = 0;
    Object.entries(areaCounts).forEach(([area, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topArea = area;
      }
    });

    if (maxCount > 0) {
      topArea = `${topArea} (${maxCount} préstamos)`;
    }

    // Calcular equipos más utilizados (Solo para Reporte de Administrador)
    const equipoCounts = {};
    prestamos.forEach(p => {
      const eqId = p.equipoId;
      if (eqId) {
        if (!equipoCounts[eqId]) {
          equipoCounts[eqId] = {
            nombre: p.equipo?.nombre || 'Desconocido',
            codigoPatrimonial: p.equipo?.codigoPatrimonial || '—',
            categoria: p.equipo?.categoria || '—',
            count: 0
          };
        }
        equipoCounts[eqId].count += 1;
      }
    });

    const topEquipos = Object.values(equipoCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Equipos actualmente en mantenimiento
    const equiposMantenimiento = equipos.filter(e => e.estado?.toLowerCase() === 'mantenimiento').slice(0, 5);

    // Préstamos activos sin devolver
    const prestamosActivos = prestamos.filter(p => !p.fechaDevolucion).slice(0, 5);

    return {
      totalEquipos,
      disponibles,
      prestados,
      mantenimiento,
      totalPrestamos,
      topArea,
      topEquipos,
      equiposMantenimiento,
      prestamosActivos
    };
  }, [equipos, prestamos]);

  // 2. Métricas y Datos para Colaborador (Personalizado)
  const collaboratorMetrics = useMemo(() => {
    if (role !== 'colaborador' || !currentUser) return null;
    
    const myLoans = prestamos.filter(p => p.usuarioId?.toLowerCase() === currentUser.id?.toLowerCase());
    const active = myLoans.filter(p => !p.fechaDevolucion);
    const total = myLoans.length;
    const available = equipos.filter(e => e.estado?.toLowerCase() === 'disponible');

    return {
      myLoans,
      activeLoansCount: active.length,
      activeLoans: active,
      totalLoansCount: total,
      availableEquiposCount: available.length,
      availableEquipos: available.slice(0, 5)
    };
  }, [role, currentUser, prestamos, equipos]);

  // RENDER: COLABORADOR
  if (role === 'colaborador') {
    const metrics = collaboratorMetrics;
    if (!metrics) return null;

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-700/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white m-0">¡Hola, {displayName}!</h3>
            <p className="text-indigo-200 text-sm max-w-xl m-0 leading-relaxed">
              Bienvenido a tu portal de activos tecnológicos. Aquí puedes solicitar préstamos de equipos, consultar tu historial y revisar la disponibilidad en tiempo real.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('prestamos')}
            className="shrink-0 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm border-0 cursor-pointer"
          >
            Solicitar Préstamo <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mis Préstamos Activos</span>
                <h4 className="mt-2 text-3xl font-bold text-gray-800 tracking-tight m-0">
                  {metrics.activeLoansCount}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                <CalendarRange className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-500">Equipos bajo tu posesión y cuidado</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mi Total de Préstamos</span>
                <h4 className="mt-2 text-3xl font-bold text-gray-800 tracking-tight m-0">
                  {metrics.totalLoansCount}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-500">Historial completo acumulado</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Equipos Disponibles</span>
                <h4 className="mt-2 text-3xl font-bold text-gray-800 tracking-tight m-0">
                  {metrics.availableEquiposCount}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-sm">
                <Laptop className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-500">Equipos disponibles en almacén</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active loans panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                <CalendarRange className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Mis Equipos Prestados Activos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <th className="px-4 py-2.5 border-b border-gray-100">Equipo</th>
                    <th className="px-4 py-2.5 border-b border-gray-100">Código</th>
                    <th className="px-4 py-2.5 border-b border-gray-100">Fecha Préstamo</th>
                    <th className="px-4 py-2.5 border-b border-gray-100 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {metrics.activeLoans.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                        No tienes préstamos activos en este momento.
                      </td>
                    </tr>
                  ) : (
                    metrics.activeLoans.map((loan, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-850">{loan.equipo?.nombre || 'Desconocido'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{loan.equipo?.codigoPatrimonial || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(loan.fechaPrestamo).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick catalog check */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-800 m-0">Equipos Disponibles Recientemente</h3>
              <p className="text-xs text-gray-500 m-0 mt-1">Busca o solicita directamente</p>
            </div>
            <div className="divide-y divide-gray-100">
              {metrics.availableEquipos.length === 0 ? (
                <p className="text-sm text-gray-450 py-4 text-center">No hay equipos disponibles en este momento.</p>
              ) : (
                metrics.availableEquipos.map((eq, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 m-0 leading-tight">{eq.nombre}</p>
                      <span className="text-[10px] text-gray-505 font-mono">{eq.codigoPatrimonial} • {eq.marca}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                      Disponible
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setActiveTab('equipos')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Ver Todo el Inventario <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: ADMINISTRADOR & RESPONSABLE DE TECNOLOGÍA
  const metrics = globalMetrics;
  const cards = [
    {
      title: 'Total de Equipos',
      value: metrics.totalEquipos,
      icon: Laptop,
      color: 'from-blue-500 to-indigo-600',
      description: 'Equipos registrados en inventario'
    },
    {
      title: 'Equipos Disponibles',
      value: metrics.disponibles,
      icon: CheckCircle,
      color: 'from-emerald-400 to-teal-600',
      description: 'Listos para ser prestados'
    },
    {
      title: 'Equipos Prestados',
      value: metrics.prestados,
      icon: CalendarRange,
      color: 'from-amber-400 to-orange-500',
      description: 'Asignados actualmente'
    },
    {
      title: 'En Mantenimiento',
      value: metrics.mantenimiento,
      icon: AlertTriangle,
      color: 'from-rose-400 to-red-600',
      description: 'Equipos fuera de servicio'
    },
    {
      title: 'Total Préstamos',
      value: metrics.totalPrestamos,
      icon: CalendarRange,
      color: 'from-purple-400 to-indigo-600',
      description: 'Historial acumulado'
    },
    {
      title: 'Área con Mayor Uso',
      value: metrics.topArea,
      icon: MapPin,
      color: 'from-fuchsia-500 to-pink-600',
      description: 'Departamento más activo',
      isText: true
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 text-white rounded-2xl p-8 shadow-lg border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 m-0">
            ¡Panel de Control ({role === 'admin' ? 'Administrador' : 'Tecnología'})!
          </h3>
          <p className="text-slate-300 text-sm max-w-2xl m-0 leading-relaxed">
            Monitoreo en tiempo real del inventario, asignaciones, mantenimiento y préstamos de activos de Innovatech.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('equipos')}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
          >
            Ver Inventario
          </button>
          <button
            onClick={() => setActiveTab('prestamos')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 border-0 rounded-xl transition-all text-xs shadow-md cursor-pointer"
          >
            Registrar Acción
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
                  <h4 className={`mt-2 font-bold text-gray-800 tracking-tight m-0 ${card.isText ? 'text-sm' : 'text-3xl'}`}>
                    {card.value}
                  </h4>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-500">{card.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section: Conditional based on Role */}
      {role === 'admin' ? (
        /* REPORT: Top Equipment (Administrador only) */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 m-0">Reporte: Equipos Más Utilizados</h3>
              <p className="text-xs text-gray-500 m-0">Frecuencia de préstamo acumulada</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <th className="px-6 py-3 border-b border-gray-100">Código</th>
                  <th className="px-6 py-3 border-b border-gray-100">Equipo</th>
                  <th className="px-6 py-3 border-b border-gray-100">Categoría</th>
                  <th className="px-6 py-3 border-b border-gray-100 text-center">N° Préstamos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {metrics.topEquipos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
                      Aún no se registran transacciones para generar este reporte.
                    </td>
                  </tr>
                ) : (
                  metrics.topEquipos.map((eq, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{eq.codigoPatrimonial}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{eq.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{eq.categoria}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                          {eq.count} préstamos
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TASKS WORKSPACE: Responsable de Tecnología only */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipos en Mantenimiento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-50 p-2 rounded-lg text-rose-600">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 m-0">Equipos en Mantenimiento</h3>
                <p className="text-xs text-gray-500 m-0">Requieren revisión técnica para estar disponibles</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {metrics.equiposMantenimiento.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">No hay equipos en mantenimiento actualmente.</p>
              ) : (
                metrics.equiposMantenimiento.map((eq, index) => (
                  <div key={index} className="py-3.5 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 m-0">{eq.nombre}</p>
                      <span className="text-[11px] text-gray-450 font-mono">{eq.codigoPatrimonial} • {eq.marca}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('equipos')}
                      className="inline-flex items-center gap-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" /> Cambiar Estado
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Préstamos Activos Recientes sin Devolver */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 m-0">Asignaciones Activas Recientes</h3>
                <p className="text-xs text-gray-500 m-0">Préstamos pendientes de registrar devolución</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {metrics.prestamosActivos.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">No hay préstamos activos pendientes en este momento.</p>
              ) : (
                metrics.prestamosActivos.map((loan, index) => (
                  <div key={index} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 m-0 leading-tight">
                        {loan.usuario ? `${loan.usuario.nombres} ${loan.usuario.apellidos}` : 'Colaborador'}
                      </p>
                      <span className="text-[11px] text-gray-500 leading-none block mt-1">
                        {loan.equipo?.nombre} ({loan.equipo?.codigoPatrimonial})
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('prestamos')}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Devolver
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
