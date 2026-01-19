
import React, { useState, useEffect } from 'react';
import { Routine, User } from '../types';
import { 
  Plus, Search, Globe, Lock, Trash2, Dumbbell, 
  ArrowRight, Star, X, Calendar as CalendarIcon, 
  ChevronRight, Weight, AlertTriangle, CheckCircle
} from 'lucide-react';

interface RoutinesProps {
  currentUser: User;
  onCreate: () => void;
}

const Routines: React.FC<RoutinesProps> = ({ currentUser, onCreate }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [tab, setTab] = useState<'all' | 'mine' | 'assigned'>('mine');
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(currentUser.activeRoutineId || null);

  const isStaff = currentUser.role !== 'client';

  useEffect(() => {
    const saved = localStorage.getItem('titan_routines');
    if (saved) {
      setRoutines(JSON.parse(saved));
    }
    // Sincronizar activeRoutineId desde titan_user si es necesario
    const savedUser = localStorage.getItem('titan_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setActiveRoutineId(u.activeRoutineId || null);
    }
  }, []);

  const selectActiveRoutine = (routineId: string) => {
    const savedUser = localStorage.getItem('titan_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      const updatedUser = { ...u, activeRoutineId: routineId };
      localStorage.setItem('titan_user', JSON.stringify(updatedUser));
      setActiveRoutineId(routineId);
      
      // También actualizar en la lista de clientes si es cliente
      if (u.role === 'client') {
        const clients = JSON.parse(localStorage.getItem('titan_customers') || '[]');
        const updatedClients = clients.map((c: any) => c.id === u.id ? { ...c, activeRoutineId: routineId } : c);
        localStorage.setItem('titan_customers', JSON.stringify(updatedClients));
      }
    }
  };

  const handleDeleteRoutine = () => {
    if (!routineToDelete) return;
    const updated = routines.filter(r => r.id !== routineToDelete);
    setRoutines(updated);
    localStorage.setItem('titan_routines', JSON.stringify(updated));
    setRoutineToDelete(null);
  };

  const filteredRoutines = routines.filter(r => {
    if (tab === 'all') return r.isPublic || (isStaff);
    if (tab === 'mine') {
      return String(r.authorId) === String(currentUser.id);
    }
    if (tab === 'assigned') return r.assignedToId === currentUser.id;
    return true;
  });

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Gestión de Rutinas</h2>
          <p className="text-slate-500 font-medium">Visualiza y organiza tus planes de entrenamiento</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={22} />
          Nueva Rutina
        </button>
      </header>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200/50 w-fit rounded-2xl">
        <TabButton active={tab === 'mine'} onClick={() => setTab('mine')} icon={<Lock size={16} />} label="Mis Rutinas" />
        <TabButton active={tab === 'all'} onClick={() => setTab('all')} icon={<Globe size={16} />} label="Galería Pública" />
        {currentUser.role === 'client' && <TabButton active={tab === 'assigned'} onClick={() => setTab('assigned')} icon={<Star size={16} />} label="Asignadas" />}
      </div>

      {filteredRoutines.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
          <Dumbbell className="mx-auto text-slate-200 mb-6" size={64} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            {tab === 'mine' ? 'No tienes rutinas personales creadas' : 'No se encontraron rutinas en esta sección'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRoutines.map(routine => (
            <div key={routine.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all z-10">
                { (isStaff || String(routine.authorId) === String(currentUser.id)) && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setRoutineToDelete(routine.id); }} 
                    className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${routine.isPublic ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {routine.isPublic ? 'Pública' : 'Privada'}
                </span>
                {activeRoutineId === routine.id && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-500 text-white flex items-center gap-1">
                    <CheckCircle size={10} /> Plan Activo
                  </span>
                )}
              </div>

              <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight uppercase italic">{routine.name}</h4>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[2.5rem]">{routine.description || 'Plan de entrenamiento Titán.'}</p>
              
              <div className="space-y-3 mb-8 flex-1">
                {DAYS.filter(d => routine.schedule[d]?.length > 0).slice(0, 3).map(day => (
                  <div key={day} className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-400 uppercase italic tracking-wider">{day}</span>
                    <span className="font-bold text-slate-700">{routine.schedule[day].length} Ejercicios</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50 mt-auto">
                {activeRoutineId !== routine.id ? (
                  <button 
                    onClick={() => selectActiveRoutine(routine.id)}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all"
                  >
                    Seleccionar como Plan Activo
                  </button>
                ) : (
                  <div className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <CheckCircle size={14} /> Actualmente en Uso
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white uppercase italic">
                      {routine.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Creado por</p>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{routine.authorName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedRoutine(routine)}
                    className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase hover:translate-x-1 transition-transform"
                  >
                    Abrir <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoutine && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 text-slate-900">
            <div className="bg-slate-900 p-8 sm:p-12 text-white relative shrink-0">
              <button onClick={() => setSelectedRoutine(null)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-xl transition-all">
                <X size={24} />
              </button>
              <div className="relative z-10 pr-12">
                <h3 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2">{selectedRoutine.name}</h3>
                <p className="text-slate-400 font-medium text-sm sm:text-base leading-relaxed">{selectedRoutine.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 custom-scrollbar">
              {DAYS.filter(day => selectedRoutine.schedule[day]?.length > 0).map(day => (
                <div key={day} className="space-y-4">
                  <h4 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                    {day}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRoutine.schedule[day].map((ex) => (
                      <div key={ex.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                            <Dumbbell size={20} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-tight">{ex.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{ex.sets} Sets • {ex.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0">
              <button 
                onClick={() => setSelectedRoutine(null)}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {routineToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">¿Eliminar Rutina?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Estás a punto de borrar permanentemente esta rutina. Se perderá toda la programación de ejercicios de los 7 días.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setRoutineToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteRoutine}
                  className="flex-1 py-4 rounded-2xl font-black bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  Confirmar Borrado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

export default Routines;
