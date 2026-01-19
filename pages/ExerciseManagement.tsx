
import React, { useState, useEffect } from 'react';
import { Exercise, User } from '../types';
import { 
  BookOpen, 
  Trash2, 
  Search, 
  Globe, 
  Lock, 
  ShieldAlert,
  User as UserIcon,
  AlertTriangle,
  X
} from 'lucide-react';

interface ExerciseManagementProps {
  currentUser: User;
}

const INITIAL_DEFAULTS: Exercise[] = [
  { id: 'e1', name: 'Press de Banca', category: 'Pecho', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e2', name: 'Sentadillas', category: 'Pierna', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e3', name: 'Peso Muerto', category: 'Espalda', authorId: 'system', authorName: 'TitanGym', isPublic: true },
  { id: 'e4', name: 'Press Militar', category: 'Hombro', authorId: 'system', authorName: 'TitanGym', isPublic: true },
];

const ExerciseManagement: React.FC<ExerciseManagementProps> = ({ currentUser }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  const loadExercises = () => {
    const saved = localStorage.getItem('titan_exercises');
    if (saved) {
      setExercises(JSON.parse(saved));
    } else {
      localStorage.setItem('titan_exercises', JSON.stringify(INITIAL_DEFAULTS));
      setExercises(INITIAL_DEFAULTS);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const confirmDelete = () => {
    if (!exerciseToDelete) return;
    
    const saved = localStorage.getItem('titan_exercises');
    if (saved) {
      const currentList: Exercise[] = JSON.parse(saved);
      const updatedList = currentList.filter(ex => ex.id !== exerciseToDelete);
      localStorage.setItem('titan_exercises', JSON.stringify(updatedList));
      setExercises(updatedList);
    }
    setExerciseToDelete(null);
  };

  const filtered = exercises.filter(ex => {
    const term = searchTerm.toLowerCase();
    return (
      (ex.name?.toLowerCase() || '').includes(term) ||
      (ex.authorName?.toLowerCase() || '').includes(term) ||
      (ex.category?.toLowerCase() || '').includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Biblioteca Global</h2>
          <p className="text-slate-500 font-medium">Moderación de movimientos y arsenal técnico</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
          <ShieldAlert size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest">Acceso Nivel Staff</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por ejercicio o autor..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold text-slate-700 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ejercicio</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privacidad</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Creado por</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic text-xs">
                        {ex.name?.charAt(0) || 'E'}
                      </div>
                      <p className="font-black text-slate-900 tracking-tight uppercase text-sm">{ex.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase italic bg-slate-100 px-3 py-1 rounded-lg">
                      {ex.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {ex.isPublic ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                          <Globe size={12} /> Público
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Lock size={12} /> Privado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <UserIcon size={14} className="text-slate-300" />
                      {ex.authorName}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setExerciseToDelete(ex.id)}
                      className="w-10 h-10 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Eliminar de la biblioteca global"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-24 text-center text-slate-300">
              <BookOpen className="mx-auto mb-4 opacity-10" size={64} />
              <p className="font-black uppercase tracking-widest text-xs">No hay ejercicios que coincidan</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center gap-6">
        <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-rose-500/20">
          <Trash2 size={32} />
        </div>
        <div>
          <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">Zona de Depuración</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">Como Staff, tienes el poder de mantener limpia la biblioteca global. Elimina cualquier ejercicio duplicado o mal nombrado.</p>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
      {exerciseToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">¿Confirmar Eliminación?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Estás a punto de eliminar este ejercicio de la <span className="text-slate-900 font-bold">Biblioteca Global</span>. Esta acción no se puede deshacer y afectará a la disponibilidad del ejercicio para nuevas rutinas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setExerciseToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl font-black bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  Eliminar Ejercicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseManagement;
