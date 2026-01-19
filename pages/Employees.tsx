
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Calendar, 
  Trash2, 
  Edit2, 
  Lock, 
  Filter, 
  CheckCircle,
  AlertCircle,
  History,
  X,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<User | null>(null);
  const [selectedEmpAttendance, setSelectedEmpAttendance] = useState<User | null>(null);
  const [employeeRecords, setEmployeeRecords] = useState<AttendanceRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'trainer' as User['role'],
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    const saved = localStorage.getItem('titan_employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      const initial: User[] = [
        { id: '1', name: 'Admin Principal', email: 'admin@titangym.com', password: 'admin123', role: 'admin', status: 'active', startDate: '2023-01-01' },
        { id: '2', name: 'Marcos Trainer', email: 'marcos@titangym.com', password: '123', role: 'trainer', status: 'active', startDate: '2023-03-15' },
      ];
      setEmployees(initial);
      localStorage.setItem('titan_employees', JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (list: User[]) => {
    setEmployees(list);
    localStorage.setItem('titan_employees', JSON.stringify(list));
  };

  const handleOpenAttendance = (emp: User) => {
    setSelectedEmpAttendance(emp);
    const saved = localStorage.getItem('titan_attendance');
    if (saved) {
      const allRecords: AttendanceRecord[] = JSON.parse(saved);
      setEmployeeRecords(allRecords.filter(r => r.employeeId === emp.id));
    } else {
      setEmployeeRecords([]);
    }
    setIsAttendanceModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingEmp(null);
    setErrorMsg(null);
    setFormData({ name: '', email: '', password: '', role: 'trainer', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: User) => {
    setEditingEmp(emp);
    setErrorMsg(null);
    setFormData({ 
      name: emp.name, 
      email: emp.email, 
      password: emp.password || '',
      role: emp.role,
      status: emp.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailExists = employees.some(emp => 
      emp.email.toLowerCase() === formData.email.toLowerCase() && (!editingEmp || editingEmp.id !== emp.id)
    );

    if (emailExists) {
      setErrorMsg('Este correo corporativo ya está asignado a otro colaborador.');
      return;
    }

    if (editingEmp) {
      const updatedList = employees.map(emp => 
        emp.id === editingEmp.id 
          ? { ...emp, ...formData } 
          : emp
      );
      saveToStorage(updatedList);
    } else {
      const employee: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        startDate: new Date().toISOString().split('T')[0]
      };
      saveToStorage([employee, ...employees]);
    }
    
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!employeeToDelete) return;
    saveToStorage(employees.filter(e => e.id !== employeeToDelete));
    setEmployeeToDelete(null);
  };

  const roleStyles: Record<string, string> = {
    admin: 'bg-slate-900 text-white border-slate-900',
    trainer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    receptionist: 'bg-blue-50 text-blue-700 border-blue-200',
    employee: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Staff & Equipo</h2>
          <p className="text-slate-500 font-medium">Gestión administrativa y control de auditoría laboral</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <UserPlus size={22} />
          Registrar Staff
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-900">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar staff..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-900/10 outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Colaborador</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cargo / Rol</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{emp.name}</p>
                        <span className="text-[10px] font-bold text-slate-400">ID: {emp.id.slice(0, 5)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest ${roleStyles[emp.role] || roleStyles.employee}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600">{emp.email}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenAttendance(emp)}
                        className="p-3 text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all shadow-sm"
                        title="Ver historial de asistencia"
                      >
                        <History size={20} />
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(emp)}
                        className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                      {emp.id !== '1' && (
                        <button 
                          onClick={() => setEmployeeToDelete(emp.id)}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE ELIMINACIÓN */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">¿Eliminar Colaborador?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Vas a revocar el acceso y eliminar el perfil de este miembro del staff. Sus registros de asistencia históricos podrían quedar huérfanos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setEmployeeToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl font-black bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  Baja Definitiva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Asistencia */}
      {isAttendanceModalOpen && selectedEmpAttendance && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 my-auto text-slate-900">
            <div className="bg-emerald-600 p-10 text-white relative">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Logs de Asistencia</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                    {selectedEmpAttendance.name.charAt(0)}
                  </div>
                  <p className="font-bold text-emerald-50">{selectedEmpAttendance.name} • {selectedEmpAttendance.role}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>

            <div className="p-10 max-h-[500px] overflow-y-auto space-y-4">
              {employeeRecords.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <Clock className="mx-auto mb-4 opacity-20" size={48} />
                  <p className="font-black uppercase tracking-widest text-xs">Sin registros de asistencia</p>
                </div>
              ) : (
                employeeRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${record.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {record.type === 'in' ? 'IN' : 'OUT'}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{record.type === 'in' ? 'Entrada Registrada' : 'Salida Registrada'}</p>
                        <p className="text-xs text-slate-400 font-bold">{new Date(record.timestamp).toLocaleString('es-ES')}</p>
                      </div>
                    </div>
                    {record.location && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                          <MapPin size={10} /> Geolocalizado
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-10 pt-0">
              <button 
                onClick={() => setIsAttendanceModalOpen(false)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edición / Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 my-auto text-slate-900">
            <div className="bg-slate-900 p-10 text-white relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-xl transition-all">
                <X size={24} />
              </button>
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                  {editingEmp ? 'Perfil del Colaborador' : 'Alta de Staff'}
                </h3>
                <p className="text-slate-400 font-medium">Asigna el correo corporativo y los permisos del sistema</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>
            
            {errorMsg && (
              <div className="mx-10 mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-black uppercase tracking-wider">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
                  <input 
                    required type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Mail size={12} /> Correo Corporativo
                  </label>
                  <input 
                    required type="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="usuario@titangym.com"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Lock size={12} /> Contraseña de Acceso
                  </label>
                  <input 
                    required type="password" value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="••••••••"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Shield size={12} /> Cargo / Responsabilidad
                  </label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800 cursor-pointer"
                  >
                    <option value="trainer">Instructor / Trainer</option>
                    <option value="receptionist">Recepcionista</option>
                    <option value="admin">Administrador</option>
                    <option value="employee">Staff Operativo / Otros</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Estado del Acceso</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800 cursor-pointer"
                  >
                    <option value="active">Activo (Acceso Total)</option>
                    <option value="inactive">Suspendido (Sin Acceso)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Cancelar</button>
                <button type="submit" className="flex-[2] px-8 py-5 rounded-2xl font-black bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-widest text-xs">
                  {editingEmp ? 'Actualizar Colaborador' : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
