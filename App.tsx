
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  LogOut, 
  TrendingUp,
  Briefcase,
  Menu,
  X,
  Dumbbell,
  User as UserIcon,
  BookOpen,
  Play
} from 'lucide-react';
import { User } from './types';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Attendance from './pages/Attendance';
import Employees from './pages/Employees';
import Routines from './pages/Routines';
import Profile from './pages/Profile';
import RoutineCreator from './pages/RoutineCreator';
import ExerciseManagement from './pages/ExerciseManagement';
import Training from './pages/Training';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'attendance' | 'employees' | 'routines' | 'profile' | 'routine-creator' | 'exercises' | 'training'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('titan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setActiveTab('dashboard');
    localStorage.setItem('titan_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    localStorage.removeItem('titan_user');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isStaff = user.role !== 'client';

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-400">
            <TrendingUp size={32} strokeWidth={2.5} />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">TitanGym</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Inicio" />
          
          <NavItem active={activeTab === 'training'} onClick={() => { setActiveTab('training'); setIsSidebarOpen(false); }} icon={<Play size={20} className="fill-current" />} label="Entrenar Ahora" />

          {isStaff && (
            <>
              <NavItem active={activeTab === 'customers'} onClick={() => { setActiveTab('customers'); setIsSidebarOpen(false); }} icon={<Users size={20} />} label="Atletas" />
              {user.role === 'admin' && <NavItem active={activeTab === 'employees'} onClick={() => { setActiveTab('employees'); setIsSidebarOpen(false); }} icon={<Briefcase size={20} />} label="Staff" />}
              <NavItem active={activeTab === 'exercises'} onClick={() => { setActiveTab('exercises'); setIsSidebarOpen(false); }} icon={<BookOpen size={20} />} label="Biblioteca Global" />
            </>
          )}

          <NavItem active={activeTab === 'routines' || activeTab === 'routine-creator'} onClick={() => { setActiveTab('routines'); setIsSidebarOpen(false); }} icon={<Dumbbell size={20} />} label="Rutinas" />
          <NavItem active={activeTab === 'attendance'} onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }} icon={<Clock size={20} />} label="Asistencia" />
          
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <NavItem active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} icon={<UserIcon size={20} />} label="Mi Perfil" />
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-50/10 transition-all font-bold text-sm">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-tighter">TitanGym</div>
          <button onClick={toggleSidebar} className="p-2 text-slate-600 bg-slate-50 rounded-lg"><Menu size={24} /></button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8 lg:p-12">
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'customers' && <Customers />}
          {activeTab === 'employees' && <Employees />}
          {activeTab === 'exercises' && <ExerciseManagement currentUser={user} />}
          {activeTab === 'attendance' && <Attendance currentUser={user} />}
          {activeTab === 'routines' && <Routines currentUser={user} onCreate={() => setActiveTab('routine-creator')} />}
          {activeTab === 'routine-creator' && <RoutineCreator currentUser={user} onSave={() => setActiveTab('routines')} onCancel={() => setActiveTab('routines')} />}
          {activeTab === 'profile' && <Profile currentUser={user} onUpdateUser={handleLogin} />}
          {activeTab === 'training' && <Training currentUser={user} />}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'}`}>
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
