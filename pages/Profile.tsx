
import React, { useState } from 'react';
import { User, Customer } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Save
} from 'lucide-react';

interface ProfileProps {
  currentUser: User;
  onUpdateUser: (u: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdateUser }) => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const isClient = currentUser.role === 'client';

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, msg: '' });

    // Validaciones
    if (currentPwd !== currentUser.password) {
      setStatus({ type: 'error', msg: 'La contraseña actual es incorrecta.' });
      return;
    }

    if (newPwd !== confirmPwd) {
      setStatus({ type: 'error', msg: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    if (newPwd.length < 4) {
      setStatus({ type: 'error', msg: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    // Actualizar en el almacenamiento correspondiente
    const storageKey = isClient ? 'titan_customers' : 'titan_employees';
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      const users: any[] = JSON.parse(storedData);
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, password: newPwd } : u
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedUsers));
    }

    // Actualizar sesión actual
    const updatedUser = { ...currentUser, password: newPwd };
    onUpdateUser(updatedUser);
    
    setStatus({ type: 'success', msg: 'Contraseña actualizada correctamente.' });
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Mi Perfil</h2>
        <p className="text-slate-500 font-medium">Configuración de cuenta y seguridad del atleta</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card de Información Personal */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20 mb-6">
              {currentUser.name.charAt(0)}
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">{currentUser.name}</h3>
            <span className="mt-2 px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {currentUser.role}
            </span>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Datos de Registro</h4>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Mail size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Email</p>
                <p className="text-sm font-bold text-slate-700 truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Calendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Desde</p>
                <p className="text-sm font-bold text-slate-700">
                  {isClient 
                    ? new Date((currentUser as Customer).registrationDate).toLocaleDateString()
                    : new Date(currentUser.startDate || '').toLocaleDateString()
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Shield size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Estado</p>
                <p className={`text-sm font-black uppercase tracking-tighter ${currentUser.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {currentUser.status === 'active' ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Cambio de Contraseña */}
        <div className="md:col-span-2">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Seguridad de la Cuenta</h3>
                <p className="text-slate-400 text-sm font-medium">Actualiza tu contraseña periódicamente</p>
              </div>
            </div>

            {status.type && (
              <div className={`mb-8 p-5 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-bold">{status.msg}</p>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Actual</label>
                <div className="relative">
                  <input 
                    required
                    type={showPwd ? 'text' : 'password'} 
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-900/10 outline-none transition-all font-bold text-slate-800"
                    placeholder="Contraseña actual"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <input 
                    required
                    type="password" 
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/20 outline-none transition-all font-bold text-slate-800"
                    placeholder="Mínimo 4 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nueva</label>
                  <input 
                    required
                    type="password" 
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500/20 outline-none transition-all font-bold text-slate-800"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
