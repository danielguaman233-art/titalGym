
import React, { useState, useEffect } from 'react';
import { Customer, MembershipPlan } from '../types';
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Calendar, 
  User as UserIcon, 
  Lock, 
  Mail, 
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    membershipType: 'basico' as MembershipPlan,
    amountPaid: 0,
    status: 'active' as 'active' | 'inactive',
    gymDays: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('titan_customers');
    if (saved) {
      setCustomers(JSON.parse(saved));
    } else {
      const initial: Customer[] = [
        { id: '1', name: 'Carlos Mendoza', email: 'carlos@mail.com', password: '123', role: 'client', registrationDate: '2023-01-15', status: 'active', membershipType: 'vip', amountPaid: 1200, expiryDate: '2024-01-15', gymDays: 24 },
        { id: '2', name: 'Maria Rodriguez', email: 'maria@mail.com', password: '123', role: 'client', registrationDate: '2023-05-20', status: 'active', membershipType: 'basico', amountPaid: 450, expiryDate: '2023-11-20', gymDays: 12 },
      ];
      setCustomers(initial);
      localStorage.setItem('titan_customers', JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (list: Customer[]) => {
    setCustomers(list);
    localStorage.setItem('titan_customers', JSON.stringify(list));
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setErrorMsg(null);
    setFormData({ name: '', email: '', password: '', membershipType: 'basico', amountPaid: 0, status: 'active', gymDays: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setErrorMsg(null);
    setFormData({ 
      name: customer.name, 
      email: customer.email, 
      password: customer.password || '',
      membershipType: customer.membershipType,
      amountPaid: customer.amountPaid,
      status: customer.status,
      gymDays: customer.gymDays || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailExists = customers.some(c => 
      c.email.toLowerCase() === formData.email.toLowerCase() && (!editingCustomer || editingCustomer.id !== c.id)
    );

    if (emailExists) {
      setErrorMsg('Este correo electrónico ya está registrado con otro atleta.');
      return;
    }
    
    if (editingCustomer) {
      const updatedList = customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...c, ...formData } 
          : c
      );
      saveToStorage(updatedList);
    } else {
      const today = new Date();
      const expiry = new Date();
      expiry.setMonth(today.getMonth() + 1);

      const customer: Customer = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        role: 'client',
        registrationDate: today.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0]
      };
      saveToStorage([customer, ...customers]);
    }
    
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!customerToDelete) return;
    saveToStorage(customers.filter(c => c.id !== customerToDelete));
    setCustomerToDelete(null);
  };

  const planStyles = {
    basico: 'bg-slate-100 text-slate-600 border-slate-200',
    pro: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    vip: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Gestión de Atletas</h2>
          <p className="text-slate-500 font-medium">Control de accesos y membresías activas</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <UserPlus size={22} />
          Nuevo Registro
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-slate-900">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-all border border-transparent">
            <Filter size={20} /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Atleta / Perfil</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email (Usuario)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan Actual</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vencimiento</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black shadow-lg">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{customer.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${customer.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {customer.status === 'active' ? '● ACTIVO' : '● INACTIVO'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{customer.email}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Racha: {customer.gymDays || 0} días</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-tighter ${planStyles[customer.membershipType]}`}>
                      {customer.membershipType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date(customer.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(customer)}
                        className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                        title="Editar información y contraseña"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => setCustomerToDelete(customer.id)}
                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE ELIMINACIÓN */}
      {customerToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">¿Eliminar Atleta?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Estás a punto de eliminar permanentemente a este atleta. Perderá todo su historial de entrenamientos, asistencia y acceso al gimnasio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setCustomerToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl font-black bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  Confirmar Baja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 my-auto">
            <div className="bg-slate-900 p-10 text-white relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-xl transition-all">
                <X size={24} />
              </button>
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                  {editingCustomer ? 'Actualizar Titán' : 'Registro de Atleta'}
                </h3>
                <p className="text-slate-400 font-medium">El email será el identificador de acceso al gimnasio</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>
            
            {errorMsg && (
              <div className="mx-10 mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-black uppercase tracking-wider">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-10 space-y-6 text-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
                  <input 
                    required type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="Nombre del atleta"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Mail size={12} /> Email (Usuario)
                  </label>
                  <input 
                    required type="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="atleta@correo.com"
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Plan de Mensualidad</label>
                  <select 
                    value={formData.membershipType}
                    onChange={(e) => setFormData({...formData, membershipType: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800 cursor-pointer"
                  >
                    <option value="basico">Básico ($450)</option>
                    <option value="pro">Pro ($750)</option>
                    <option value="vip">VIP ($1200)</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Monto Cobrado ($)</label>
                  <input 
                    required type="number" value={formData.amountPaid}
                    onChange={(e) => setFormData({...formData, amountPaid: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Estado del Atleta</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800 cursor-pointer"
                  >
                    <option value="active">Activo (Acceso permitido)</option>
                    <option value="inactive">Inactivo (Acceso denegado)</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Días Registrados (Streak)</label>
                  <input 
                    type="number" value={formData.gymDays}
                    onChange={(e) => setFormData({...formData, gymDays: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Descartar</button>
                <button type="submit" className="flex-[2] px-8 py-5 rounded-2xl font-black bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-widest text-xs">
                  {editingCustomer ? 'Guardar Cambios' : 'Finalizar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
