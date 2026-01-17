
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeSuggestions } from '../services/geminiService';
import { Suggestion, Activity } from '../types';

const Dashboard: React.FC = () => {
  const [suggestions] = useState<Suggestion[]>([
    { id: '1', customerId: 'c1', customerName: 'Juan Perez', text: 'Me gustaría que abrieran a las 5 AM', date: '2023-10-20', category: 'Horario' },
    { id: '2', customerId: 'c2', customerName: 'Ana Gomez', text: 'Faltan mancuernas de 10kg', date: '2023-10-21', category: 'Equipo' },
    { id: '3', customerId: 'c3', customerName: 'Luis Rios', text: 'El aire acondicionado no enfría suficiente', date: '2023-10-22', category: 'Infraestructura' },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', title: 'Mantenimiento de máquinas cardio', dueDate: 'Hoy', completed: false },
    { id: '2', title: 'Revisión de inventario de suplementos', dueDate: 'Mañana', completed: false },
    { id: '3', title: 'Entrevista para nuevo instructor', dueDate: '25 Oct', completed: true },
  ]);

  const [aiInsight, setAiInsight] = useState<string>('Analizando sugerencias con IA...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      setIsAnalyzing(true);
      const analysis = await analyzeSuggestions(suggestions);
      setAiInsight(analysis);
      setIsAnalyzing(false);
    };
    fetchAIAnalysis();
  }, [suggestions]);

  const chartData = [
    { name: 'Lun', ingresos: 45 },
    { name: 'Mar', ingresos: 52 },
    { name: 'Mie', ingresos: 48 },
    { name: 'Jue', ingresos: 61 },
    { name: 'Vie', ingresos: 55 },
    { name: 'Sab', ingresos: 40 },
    { name: 'Dom', ingresos: 25 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard General</h2>
          <p className="text-slate-500 text-sm">Resumen para hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 text-slate-600 font-medium w-fit">
          <Calendar size={18} />
          <span className="text-sm">Filtrar Periodo</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard 
          icon={<Users size={24} />} 
          label="Ingresos Hoy" 
          value="42" 
          trend="+12% vs ayer" 
          color="emerald" 
        />
        <KpiCard 
          icon={<UserPlus size={24} />} 
          label="Inscritos Hoy" 
          value="8" 
          trend="Meta: 10" 
          color="blue" 
        />
        <KpiCard 
          icon={<ClipboardList size={24} />} 
          label="Pendientes" 
          value="5" 
          trend="Prioridad Alta" 
          color="amber" 
        />
        <KpiCard 
          icon={<MessageSquare size={24} />} 
          label="Sugerencias" 
          value="3" 
          trend="Nuevas críticas" 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Flujo Semanal</h3>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="ingresos" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Actividades</h3>
            <button className="text-emerald-600 font-bold text-sm hover:underline">Ver todo</button>
          </div>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${activity.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                  {activity.completed && <CheckSquare size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${activity.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{activity.title}</p>
                  <span className="text-xs text-slate-400">{activity.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Análisis Inteligente</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/20">
            {isAnalyzing ? (
              <p className="animate-pulse italic opacity-80">Escaneando...</p>
            ) : (
              <p className="text-sm sm:text-base leading-relaxed opacity-95">{aiInsight}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    blue: 'bg-blue-500/10 text-blue-600',
    amber: 'bg-amber-500/10 text-amber-600',
    rose: 'bg-rose-500/10 text-rose-600'
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{value}</h3>
        </div>
      </div>
      <div className="mt-4 flex items-center text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-lg">
        {trend}
      </div>
    </div>
  );
};

export default Dashboard;
