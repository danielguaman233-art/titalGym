
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ClipboardList, MessageSquare, Sparkles, Calendar, CheckSquare, Flame, Trophy, Activity as ActivityIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeSuggestions } from '../services/geminiService';
import { Suggestion, Activity, User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isClient = user.role === 'client';
  
  const [suggestions] = useState<Suggestion[]>([
    { id: '1', customerId: 'c1', customerName: 'Juan Perez', text: 'Me gustaría que abrieran a las 5 AM', date: '2023-10-20', category: 'Horario' },
    { id: '2', customerId: 'c2', customerName: 'Ana Gomez', text: 'Faltan mancuernas de 10kg', date: '2023-10-21', category: 'Equipo' },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', title: 'Entrenamiento de Pierna', dueDate: 'Hoy 18:00', completed: false },
    { id: '2', title: 'Cardio LISS 30min', dueDate: 'Hoy 19:00', completed: false },
  ]);

  const [aiInsight, setAiInsight] = useState<string>('Cargando motivación...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      setIsAnalyzing(true);
      const prompt = isClient 
        ? "Genera una frase motivadora de 2 líneas para un atleta de gimnasio que lleva 12 días entrenando sin parar."
        : "Analiza sugerencias de clientes: " + suggestions.map(s => s.text).join(', ');
      
      const analysis = await analyzeSuggestions(suggestions); // Nota: En una app real pasaríamos el prompt custom
      setAiInsight(isClient ? "¡Sigue así, Titán! Estás en el 10% superior de consistencia este mes. Tu meta de 20 días está cerca." : analysis);
      setIsAnalyzing(false);
    };
    fetchAIAnalysis();
  }, [isClient, suggestions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
            {isClient ? `¡Hola, ${user.name.split(' ')[0]}!` : 'Resumen Operativo'}
          </h2>
          <p className="text-slate-500 font-medium">Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isClient ? (
          <>
            <KpiCard icon={<Flame size={24} />} label="Racha Actual" value={`${user.gymDays || 0} Días`} trend="¡Nivel Fuego!" color="rose" />
            <KpiCard icon={<Trophy size={24} />} label="Nivel" value="Titán Plata" trend="5 días para Oro" color="amber" />
            <KpiCard icon={<ActivityIcon size={24} />} label="Calorías Est." value="2,450" trend="Promedio diario" color="emerald" />
            <KpiCard icon={<Calendar size={24} />} label="Próximo Pago" value="15 Nov" trend="Plan VIP" color="blue" />
          </>
        ) : (
          <>
            <KpiCard icon={<Users size={24} />} label="Ingresos Hoy" value="42" trend="+12% vs ayer" color="emerald" />
            <KpiCard icon={<UserPlus size={24} />} label="Inscritos Hoy" value="8" trend="Meta: 10" color="blue" />
            <KpiCard icon={<ClipboardList size={24} />} label="Pendientes Staff" value="5" trend="Prioridad Alta" color="amber" />
            <KpiCard icon={<MessageSquare size={24} />} label="Sugerencias" value="3" trend="Por leer" color="rose" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter italic">Consistencia Mensual</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name:'Sem 1', v:20}, {name:'Sem 2', v:35}, {name:'Sem 3', v:45}, {name:'Sem 4', v:30}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="v" radius={[10, 10, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Mis Objetivos</h3>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-500/20 transition-all">
                <div className="w-6 h-6 rounded border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  {activity.completed && <CheckSquare size={16} className="text-emerald-500" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-400">{activity.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Titan AI Assistant</h3>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-slate-200">
            {isAnalyzing ? <p className="animate-pulse">Consultando al Oráculo...</p> : <p className="leading-relaxed font-medium">{aiInsight}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, label, value, trend, color }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    blue: 'bg-blue-500/10 text-blue-600',
    amber: 'bg-amber-500/10 text-amber-600',
    rose: 'bg-rose-500/10 text-rose-600'
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
      </div>
      <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest w-fit">{trend}</div>
    </div>
  );
};

export default Dashboard;
