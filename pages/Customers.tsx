
import React, { useState, useEffect } from 'react';
import { Customer, MembershipPlan } from '../types';
import { Search, UserPlus, Filter, MoreHorizontal, CheckCircle, XCircle, CreditCard, Calendar } from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    email: '', 
    membershipType: 'basico' as MembershipPlan,
    amountPaid: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('titan_customers');
    if (saved) {
      setCustomers(JSON.parse(saved));
    } else {
      const initial: Customer[] = [
        { id: '1', name: 'Carlos Mendoza', email: 'carlos@mail.com', registrationDate: '2023-01-15', status: 'active', membershipType: 'vip', amountPaid: 1200, expiryDate: '2024-01-15' },
        { id: '2', name: 'Maria Rodriguez', email: 'maria@mail.com', registrationDate: '2023-05-20', status: 'active', membershipType: 'basico', amountPaid: 450, expiryDate: '2023-11-20' },
      ];
      setCustomers(initial);
      localStorage.setItem('titan_customers', JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (list: Customer[]) => {
    setCustomers(list);
    localStorage.setItem('titan_customers', JSON.stringify(list));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const expiry = new Date();
    expiry.setMonth(today.getMonth() + 1); // Por defecto un mes

    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name,
      email: newCustomer.email,
      registrationDate: today.toISOString().split('T')[0],
      status: 'active',
      membershipType: newCustomer.membershipType,
      amountPaid: newCustomer.amountPaid,
      expiryDate: expiry.toISOString().split('T')[0]
    };
    saveToStorage([customer, ...customers]);
    setIsModalOpen(false);
    setNewCustomer({ name: '', email: '', membershipType: 'basico', amountPaid: 0 });
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Miembros</h2>
          <p className="text-slate-500 font-medium">Gestión de suscripciones y control de mensualidades</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <UserPlus size={22} />
          Inscribir Atleta
        </button>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o ID de miembro..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
            <Filter size={20} />
            Filtros Avanzados
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Atleta</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Suscripción</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vencimiento</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black shadow-inner">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{customer.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex flex-col px-4 py-2 rounded-xl border-2 ${planStyles[customer.membershipType]}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Plan</span>
                      <span className="text-sm font-black uppercase leading-none">{customer.membershipType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date(customer.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-tighter ${customer.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                      <div className={`w-2 h-2 rounded-full ${customer.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      {customer.status === 'active' ? 'Al día' : 'Pendiente'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-300 hover:text-slate-900 p-2 rounded-xl transition-all hover:bg-white hover:shadow-md">
                      <MoreHorizontal size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Nueva Inscripción</h3>
                <p className="text-slate-400 font-medium">Bienvenido al equipo de Titanes</p>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nombre del Miembro</label>
                  <input 
                    required
                    type="text" 
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="Nombre y Apellidos"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Plan de Mensualidad</label>
                  <select 
                    value={newCustomer.membershipType}
                    onChange={(e) => setNewCustomer({...newCustomer, membershipType: e.target.value as any})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="basico">Plan Básico ($450)</option>
                    <option value="pro">Plan Pro Gym ($750)</option>
                    <option value="vip">Plan VIP All Access ($1200)</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Monto Cobrado ($)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                    <input 
                      required
                      type="number" 
                      value={newCustomer.amountPaid}
                      onChange={(e) => setNewCustomer({...newCustomer, amountPaid: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Email de Contacto</label>
                  <input 
                    required
                    type="email" 
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-black text-slate-800"
                    placeholder="atleta@correo.com"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-8 py-5 rounded-2xl font-black bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Registrar e Imprimir Recibo
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
