
import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, ShieldCheck, Dumbbell } from 'lucide-react';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@titangym.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate with backend. Mocking here.
    // Fixed: Added missing 'status' property to comply with User interface definition
    const mockUser: User = {
      id: '1',
      name: email === 'admin@titangym.com' ? 'Admin Titan' : 'Empleado Titan',
      email,
      role: email === 'admin@titangym.com' ? 'admin' : 'employee',
      status: 'active'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white transform rotate-12 shadow-lg">
              <Dumbbell size={32} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bienvenido a TitanGym</h1>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="ejemplo@gym.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <LogIn size={20} />
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
            <ShieldCheck size={14} />
            Acceso Seguro
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
