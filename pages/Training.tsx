
import React, { useState, useEffect } from 'react';
import { User, Routine, ScheduledExercise, WorkoutLog, ExerciseLog, SetLog } from '../types';
import { 
  Play, 
  CheckCircle, 
  Dumbbell, 
  Trophy, 
  Calendar, 
  Flame, 
  History,
  TrendingUp, 
  ChevronRight,
  PartyPopper,
  ArrowRight,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface TrainingProps {
  currentUser: User;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAYS_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Training: React.FC<TrainingProps> = ({ currentUser }) => {
  const [view, setView] = useState<'training' | 'completed' | 'history'>('training');
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<ExerciseLog[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [dayName] = useState(DAYS[new Date().getDay()]);
  const [historyLogs, setHistoryLogs] = useState<WorkoutLog[]>([]);
  const [filterDay, setFilterDay] = useState<string | null>(null);

  useEffect(() => {
    checkTodayStatus();
    loadHistory();
  }, [dayName]);

  const checkTodayStatus = () => {
    const savedUser = localStorage.getItem('titan_user');
    if (!savedUser) return;
    
    const u = JSON.parse(savedUser);
    const logs = JSON.parse(localStorage.getItem('titan_workout_logs') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si ya se entrenó hoy
    const trainedToday = logs.some((l: WorkoutLog) => l.date.split('T')[0] === today && l.userId === currentUser.id);
    
    if (trainedToday) {
      setView('completed');
    } else {
      loadActiveRoutine(u.activeRoutineId);
    }
  };

  const loadActiveRoutine = (routineId?: string) => {
    if (routineId) {
      const routines = JSON.parse(localStorage.getItem('titan_routines') || '[]');
      const routine = routines.find((r: Routine) => r.id === routineId);
      
      if (routine) {
        setActiveRoutine(routine);
        const scheduledToday = routine.schedule[dayName] || [];
        const initialLogs: ExerciseLog[] = scheduledToday.map((ex: ScheduledExercise) => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: Array.from({ length: ex.sets }).map(() => ({
            reps: 0,
            weight: ex.weight,
            completed: false
          }))
        }));
        setTodayWorkout(initialLogs);
      }
    }
  };

  const loadHistory = () => {
    const logs = JSON.parse(localStorage.getItem('titan_workout_logs') || '[]');
    setHistoryLogs(logs.filter((l: WorkoutLog) => l.userId === currentUser.id));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof SetLog, value: any) => {
    const updated = [...todayWorkout];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value
    };
    setTodayWorkout(updated);
  };

  const handleFinishWorkout = () => {
    if (todayWorkout.length === 0) return;
    
    setIsFinishing(true);
    
    const workoutRecord: WorkoutLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      routineId: activeRoutine?.id || '',
      date: new Date().toISOString(),
      dayName: dayName,
      exercises: todayWorkout
    };

    const savedLogs = JSON.parse(localStorage.getItem('titan_workout_logs') || '[]');
    localStorage.setItem('titan_workout_logs', JSON.stringify([workoutRecord, ...savedLogs]));

    setTimeout(() => {
      setIsFinishing(false);
      setView('completed');
      loadHistory();
    }, 1000);
  };

  const filteredHistory = filterDay 
    ? historyLogs.filter(log => log.dayName === filterDay)
    : historyLogs;

  // Renderizado de la vista de HISTÓRICO
  if (view === 'history') {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-6 duration-500">
        <header className="flex items-center justify-between">
          <button 
            onClick={() => setView('completed')}
            className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Bitácora de Guerrero</h2>
        </header>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterDay(null)}
              className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${!filterDay ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              Todos
            </button>
            {DAYS_ORDER.map(day => (
              <button 
                key={day}
                onClick={() => setFilterDay(day)}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${filterDay === day ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha / Día</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ejercicio</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Peso Máx</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                      No hay registros para este filtro
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(log => (
                    log.exercises.map((ex, idx) => {
                      const maxWeight = Math.max(...ex.sets.map(s => s.weight));
                      const totalReps = ex.sets.reduce((acc, s) => acc + s.reps, 0);
                      return (
                        <tr key={`${log.id}-${ex.exerciseId}`} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-5">
                            <p className="font-black text-slate-900 uppercase text-[10px]">{new Date(log.date).toLocaleDateString()}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{log.dayName}</p>
                          </td>
                          <td className="py-5">
                            <p className="font-black text-slate-800 uppercase italic text-xs">{ex.name}</p>
                          </td>
                          <td className="py-5 text-center">
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black text-[10px] border border-emerald-100">
                              {maxWeight} KG
                            </span>
                          </td>
                          <td className="py-5 text-center">
                            <p className="font-black text-slate-600 text-xs">{totalReps}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">{ex.sets.length} Series</p>
                          </td>
                        </tr>
                      );
                    })
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado de la vista de COMPLETADO
  if (view === 'completed') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in-95 duration-500 p-8">
        <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 relative">
          <PartyPopper size={64} />
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white">
            <Trophy size={20} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">¡Ya has completado el entrenamiento de hoy!</h2>
          <p className="text-slate-500 text-lg font-medium">Mañana será un nuevo día para romper tus límites, Titán.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => setView('history')}
            className="flex-1 bg-white border-2 border-slate-900 text-slate-900 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <History size={18} /> Ver Histórico
          </button>
          <button 
            onClick={() => window.location.href = '#'} // Simular ir a dashboard o similar si el app.tsx lo maneja
            className="flex-1 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
          >
            Panel Principal <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!activeRoutine) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-700 p-8">
        <div className="w-24 h-24 bg-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 mb-4 animate-bounce">
          <Dumbbell size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Sin Rutina Activa</h2>
        <p className="text-slate-500 max-w-md font-medium">
          Parece que aún no has seleccionado una rutina para seguir. Ve a la sección de <span className="text-emerald-500 font-bold">Rutinas</span> y elige tu plan de batalla.
        </p>
      </div>
    );
  }

  // Renderizado de la vista de ENTRENAMIENTO ACTIVO
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Sesión Activa</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{dayName}, {new Date().toLocaleDateString()}</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            {activeRoutine.name}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('history')}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all"
          >
            Historial
          </button>
          <button 
            onClick={handleFinishWorkout}
            disabled={isFinishing || todayWorkout.length === 0}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-300"
          >
            {isFinishing ? 'Guardando...' : <><CheckCircle size={20} /> Terminar Entrenamiento</>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {todayWorkout.map((exercise, exIdx) => (
          <div key={exercise.exerciseId} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                  <Dumbbell size={24} />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2 leading-tight">
                  {exercise.name}
                </h3>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${(exercise.sets.filter(s => s.completed).length / exercise.sets.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  {Math.round((exercise.sets.filter(s => s.completed).length / exercise.sets.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex-1 p-8 sm:p-10 overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="text-left">
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">SET</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PESO (KG)</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">REPS</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">LISTO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {exercise.sets.map((set, sIdx) => (
                    <tr key={sIdx} className={`group transition-colors ${set.completed ? 'opacity-50 grayscale' : ''}`}>
                      <td className="py-4">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500">
                          {sIdx + 1}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          disabled={set.completed}
                          className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none font-black text-slate-700 text-sm transition-all"
                          value={set.weight}
                          onChange={(e) => updateSet(exIdx, sIdx, 'weight', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input 
                          type="number" 
                          disabled={set.completed}
                          className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none font-black text-slate-700 text-sm transition-all"
                          value={set.reps}
                          placeholder="0"
                          onChange={(e) => updateSet(exIdx, sIdx, 'reps', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => updateSet(exIdx, sIdx, 'completed', !set.completed)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                            set.completed 
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                              : 'bg-slate-100 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 shadow-none'
                          }`}
                        >
                          <CheckCircle size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[50]">
        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Estatus Diario</p>
              <p className="text-xl font-black italic uppercase tracking-tighter">{todayWorkout.length > 0 ? 'Entrenando' : 'Listo'}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 mx-2"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Racha</p>
            <p className="text-xl font-black italic uppercase tracking-tighter">{currentUser.gymDays || 0} Días</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
