
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { UserPlus, Search, Shield, Mail, Calendar, Trash2, Edit2 } from 'lucide-react';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', role: 'trainer' });

  useEffect(() => {
    const saved = localStorage.getItem('titan_employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      const initial: User[] = [
        { id: '1', name: 'Admin Principal', email: 'admin@titangym.com', role: 'admin', status: 'active', startDate: '2023-01-01' },
        { id: '2', name: 'Marcos Trainer', email: 'marcos@titangym.com', role: 'trainer', status: 'active', startDate: '2023-03-15' },
      ];
      setEmployees(initial);
      localStorage.setItem('titan_employees', JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (list: User[]) => {
    setEmployees(list);
    localStorage.setItem('titan_employees', JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEmp.name,
      email: newEmp.email,
      role: newEmp.role as any,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0]
    };
    saveToStorage([employee, ...employees]);
    setIsModalOpen(false);
    setNewEmp({ name: '', email: '', role: 'trainer' });
  };

  const deleteEmployee = (id: string) => {
    if (confirm('¿Estás seguro de eliminar a este empleado?')) {
      saveToStorage(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Staff & Equipo</h2>
          <p className="text-slate-500 mt-1 font-medium">Control total sobre el personal operativo del gimnasio</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <UserPlus size={20} />
          Registrar Personal
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o cargo..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Rol</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Ingreso</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail size={12} /> {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      emp.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                      emp.role === 'trainer' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                      <Calendar size={14} className="text-slate-400" />
                      {emp.startDate ? new Date(emp.startDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(emp.id)}
                        className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Alta de Personal</h3>
                  <p className="text-slate-500 text-sm">Asigna roles y permisos de acceso</p>
                </div>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      value={newEmp.name}
                      onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-bold text-slate-800"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Correo Corporativo</label>
                    <input 
                      required
                      type="email" 
                      value={newEmp.email}
                      onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-bold text-slate-800"
                      placeholder="usuario@titangym.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cargo / Responsabilidad</label>
                    <select 
                      value={newEmp.role}
                      onChange={(e) => setNewEmp({...newEmp, role: e.target.value as any})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-bold text-slate-800 appearance-none"
                    >
                      <option value="trainer">Instructor / Trainer</option>
                      <option value="receptionist">Recepcionista</option>
                      <option value="admin">Administrador</option>
                      <option value="employee">Mantenimiento / Otros</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-2xl font-black bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Confirmar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
