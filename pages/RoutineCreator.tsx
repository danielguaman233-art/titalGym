
import React, { useState, useEffect } from 'react';
import { User, Routine, ScheduledExercise, Exercise } from '../types';
import { 
  Dumbbell, 
  Trash2, 
  Save, 
  X, 
  PlusCircle, 
  ChevronRight, 
  Search,
  Check,
  LayoutGrid,
  Globe,
  Lock,
  Plus
} from 'lucide-react';

interface RoutineCreatorProps {
  currentUser: User;
  onSave: () => void;
  onCancel: () => void;
}

const INITIAL_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Press de Banca', category: 'Pecho', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e2', name: 'Sentadillas', category: 'Pierna', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e3', name: 'Peso Muerto', category: 'Espalda', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e4', name: 'Press Militar', category: 'Hombro', authorId: 'system', authorName: 'TitanGym', isPublic: true },
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const RoutineCreator: React.FC<RoutineCreatorProps> = ({ currentUser, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [exercisesLibrary, setExercisesLibrary] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [schedule, setSchedule] = useState<{ [key: string]: ScheduledExercise[] }>({
    Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [], Domingo: []
  });

  const [activeDropDay, setActiveDropDay] = useState<string | null>(null);
  const [configModal, setConfigModal] = useState<{ day: string, exerciseName: string } | null>(null);
  const [newExerciseModal, setNewExerciseModal] = useState(false);
  const [tempConfig, setTempConfig] = useState({ sets: 4, weight: 0 });
  const [newExForm, setNewExForm] = useState({ name: '', category: 'General', isPublic: true });

  useEffect(() => {
    const saved = localStorage.getItem('titan_exercises');
    if (saved) {
      setExercisesLibrary(JSON.parse(saved));
    } else {
      setExercisesLibrary(INITIAL_EXERCISES);
      localStorage.setItem('titan_exercises', JSON.stringify(INITIAL_EXERCISES));
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, exerciseName: string) => {
    e.dataTransfer.setData('exerciseName', exerciseName);
  };

  const handleDrop = (e: React.DragEvent, day: string) => {
    e.preventDefault();
    const exerciseName = e.dataTransfer.getData('exerciseName');
    if (exerciseName) {
      setConfigModal({ day, exerciseName });
      setTempConfig({ sets: 4, weight: 0 });
    }
    setActiveDropDay(null);
  };

  const confirmExercise = () => {
    if (configModal) {
      const newEx: ScheduledExercise = {
        id: Math.random().toString(36).substr(2, 9),
        name: configModal.exerciseName,
        sets: tempConfig.sets,
        weight: tempConfig.weight
      };
      
      setSchedule(prev => ({
        ...prev,
        [configModal.day]: [...prev[configModal.day], newEx]
      }));
      setConfigModal(null);
    }
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExForm.name) return;

    const newEx: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: newExForm.name,
      category: newExForm.category,
      authorId: currentUser.id,
      authorName: currentUser.name,
      isPublic: newExForm.isPublic
    };

    const updated = [...exercisesLibrary, newEx];
    setExercisesLibrary(updated);
    localStorage.setItem('titan_exercises', JSON.stringify(updated));
    setNewExerciseModal(false);
    setNewExForm({ name: '', category: 'General', isPublic: true });
  };

  const removeExerciseFromDay = (day: string, id: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(ex => ex.id !== id)
    }));
  };

  const handleSaveRoutine = () => {
    if (!name) return alert('Por favor, asigne un nombre a la rutina');
    
    const newRoutine: Routine = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      authorId: currentUser.id,
      authorName: currentUser.name,
      isPublic,
      schedule,
      createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('titan_routines');
    const all = saved ? JSON.parse(saved) : [];
    localStorage.setItem('titan_routines', JSON.stringify([newRoutine, ...all]));
    onSave();
  };

  const filteredLibrary = exercisesLibrary.filter(ex => 
    (ex.isPublic || ex.authorId === currentUser.id) &&
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col gap-6 animate-in fade-in duration-500 overflow-hidden pb-4">
      {/* Header Fijo */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 gap-4 shrink-0">
        <div className="flex-1 space-y-1">
          <input 
            type="text" 
            placeholder="NOMBRE DE LA RUTINA" 
            className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter w-full bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Añade descripción..." 
            className="text-slate-400 font-medium w-full bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-200 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-xl">
            <button onClick={() => setIsPublic(true)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isPublic ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>
              <Globe size={12} /> Pública
            </button>
            <button onClick={() => setIsPublic(false)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isPublic ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}`}>
              <Lock size={12} /> Privada
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="px-4 py-3 rounded-xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Cancelar</button>
            <button onClick={handleSaveRoutine} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
              <Save size={16} /> Guardar
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal 70/30 */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 min-h-0">
        {/* Lado Izquierdo: Planificación (70%) */}
        <div className="flex-[7] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar lg:h-full content-start pb-8">
          {DAYS.map(day => (
            <div 
              key={day}
              onDragOver={(e) => { e.preventDefault(); setActiveDropDay(day); }}
              onDragLeave={() => setActiveDropDay(null)}
              onDrop={(e) => handleDrop(e, day)}
              className={`min-h-[250px] max-h-[350px] bg-white rounded-[2rem] border-2 transition-all p-5 flex flex-col ${
                activeDropDay === day 
                ? 'border-emerald-500 bg-emerald-50/20 scale-[1.01] shadow-lg shadow-emerald-500/5' 
                : 'border-transparent shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-[10px] font-black text-slate-900 uppercase italic tracking-[0.1em]">{day}</h3>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {schedule[day].length}
                </span>
              </div>

              {/* CONTENEDOR DE EJERCICIOS CON SCROLL INTERNO */}
              <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar-thin">
                {schedule[day].length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-200 border-2 border-dashed border-slate-50 rounded-2xl p-4 text-center">
                    <PlusCircle size={20} className="mb-1.5 opacity-20" />
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Soltar aquí</p>
                  </div>
                ) : (
                  schedule[day].map((ex) => (
                    <div key={ex.id} className="group p-3 bg-slate-50 rounded-xl border border-slate-100 relative hover:border-emerald-500/20 hover:bg-white transition-all animate-in slide-in-from-top-1">
                      {/* Botón de eliminar del día - MEJORADO AREA DE CLIC */}
                      <button 
                        onClick={() => removeExerciseFromDay(day, ex.id)}
                        className="absolute -top-1 -right-1 w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-600 z-10 scale-90 group-hover:scale-100"
                        title="Quitar de este día"
                      >
                        <Trash2 size={14} />
                      </button>
                      <p className="text-[9px] font-black text-slate-800 uppercase mb-1 leading-tight pr-4">{ex.name}</p>
                      <div className="flex gap-2 text-[8px] font-bold text-slate-400">
                        <span className="bg-white px-1 py-0.5 rounded border border-slate-100">{ex.sets} SETS</span>
                        <span className="bg-white px-1 py-0.5 rounded border border-slate-100">{ex.weight} KG</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lado Derecho: Biblioteca (30%) */}
        <div className="flex-[3] bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden lg:h-full">
          <div className="p-5 border-b border-slate-50 shrink-0 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest flex items-center gap-2">
              <LayoutGrid size={14} className="text-emerald-500" />
              Biblioteca
            </h3>
            <button 
              onClick={() => setNewExerciseModal(true)}
              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
              title="Añadir nuevo ejercicio"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="p-4 border-b border-slate-50 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[10px] font-bold border-none focus:ring-1 focus:ring-emerald-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredLibrary.map(ex => (
              <div 
                key={ex.id}
                draggable
                onDragStart={(e) => handleDragStart(e, ex.name)}
                className="p-3 bg-white border border-slate-100 rounded-xl cursor-grab active:cursor-grabbing hover:border-emerald-500/30 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-slate-800 uppercase tracking-tight leading-tight truncate">{ex.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase italic mt-0.5">{ex.category}</p>
                </div>
                {!ex.isPublic && <Lock size={10} className="text-slate-300 ml-2" />}
                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all ml-2 shrink-0">
                  <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 shrink-0">
             <p className="text-[8px] text-center font-bold text-slate-400 uppercase tracking-[0.1em]">TIP: ARRASTRA EJERCICIOS AL DÍA</p>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo Ejercicio */}
      {newExerciseModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10">
            <div className="bg-emerald-600 p-8 text-white">
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-1">Nuevo Movimiento</h3>
              <p className="text-emerald-100 font-bold text-[9px] uppercase tracking-widest">Crea tu propio ejercicio</p>
            </div>
            <form onSubmit={handleCreateExercise} className="p-8 space-y-5">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
                <input required type="text" value={newExForm.name} onChange={(e) => setNewExForm({...newExForm, name: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none font-bold text-xs focus:ring-1 focus:ring-emerald-500/30" placeholder="Ej. Jalón tras nuca" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Músculo</label>
                  <select value={newExForm.category} onChange={(e) => setNewExForm({...newExForm, category: e.target.value})} className="w-full px-3 py-3 rounded-xl bg-slate-50 border-none font-bold text-[10px] uppercase cursor-pointer">
                    <option>Pecho</option><option>Espalda</option><option>Pierna</option><option>Hombro</option><option>Brazo</option><option>Core</option><option>Cardio</option>
                  </select>
                </div>
                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Privacidad</label>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setNewExForm({...newExForm, isPublic: true})} className={`flex-1 py-1.5 rounded-md text-[8px] font-black uppercase transition-all ${newExForm.isPublic ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Público</button>
                      <button type="button" onClick={() => setNewExForm({...newExForm, isPublic: false})} className={`flex-1 py-1.5 rounded-md text-[8px] font-black uppercase transition-all ${!newExForm.isPublic ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Privado</button>
                   </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setNewExerciseModal(false)} className="flex-1 py-4 rounded-xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[9px]">Cancelar</button>
                <button type="submit" className="flex-[1.5] py-4 rounded-xl font-black bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-widest text-[9px]">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Configuración de Carga (al soltar) */}
      {configModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 text-white">
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-1">Configurar Carga</h3>
              <p className="text-emerald-400 font-bold text-[9px] uppercase tracking-widest">{configModal.exerciseName}</p>
            </div>
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sets (Series)</label>
                  <input type="number" value={tempConfig.sets} onChange={(e) => setTempConfig({...tempConfig, sets: parseInt(e.target.value) || 0})} className="w-full px-5 py-3 rounded-xl bg-slate-50 font-black text-slate-800 focus:ring-1 focus:ring-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Peso (KG)</label>
                  <input type="number" value={tempConfig.weight} onChange={(e) => setTempConfig({...tempConfig, weight: parseInt(e.target.value) || 0})} className="w-full px-5 py-3 rounded-xl bg-slate-50 font-black text-slate-800 focus:ring-1 focus:ring-emerald-500/20" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setConfigModal(null)} className="flex-1 py-4 rounded-xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[9px]">Cancelar</button>
                <button onClick={confirmExercise} className="flex-[1.5] py-4 rounded-xl font-black bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[9px]"><Check size={16} /> Añadir</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default RoutineCreator;
