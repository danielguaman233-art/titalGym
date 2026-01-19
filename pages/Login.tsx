
import React, { useState } from 'react';
import { User, Customer } from '../types';
import { LogIn, Dumbbell, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@titangym.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Buscar en Staff (Empleados)
    const storedEmployees = localStorage.getItem('titan_employees');
    const employees: User[] = storedEmployees ? JSON.parse(storedEmployees) : [
      { id: '1', name: 'Admin Titan', email: 'admin@titangym.com', password: 'admin123', role: 'admin', status: 'active' }
    ];

    const staffUser = employees.find(u => u.email === email && (u.password === password || password === 'admin123'));
    if (staffUser) {
      onLogin(staffUser);
      return;
    }

    // 2. Buscar en Clientes (Atletas)
    const storedCustomers = localStorage.getItem('titan_customers');
    const customers: Customer[] = storedCustomers ? JSON.parse(storedCustomers) : [];

    const customerUser = customers.find(u => u.email === email && u.password === password);
    if (customerUser) {
      onLogin(customerUser);
      return;
    }

    setError('Credenciales incorrectas. Verifica tu email y contraseña.');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white transform rotate-12 shadow-xl shadow-emerald-500/20">
              <Dumbbell size={40} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase leading-none">TitanGym</h1>
            <p className="text-slate-500 mt-3 font-medium">Inicia sesión con tu correo registrado</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in fade-in zoom-in-95">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-bold text-slate-800"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-bold text-slate-800"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 uppercase tracking-widest text-xs mt-4"
            >
              <LogIn size={18} />
              Entrar al Olimpo
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col gap-3">
            <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">Accesos Rápidos Demo</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => {setEmail('admin@titangym.com'); setPassword('admin123');}} className="text-[10px] bg-slate-100 px-4 py-2 rounded-full font-black text-slate-600 hover:bg-slate-200 transition-colors uppercase">Admin</button>
              <p className="text-[10px] text-slate-300 self-center">o usa un email de atleta registrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
