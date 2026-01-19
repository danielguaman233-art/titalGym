
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ClipboardList, MessageSquare, Sparkles, Calendar, CheckSquare, Flame, Trophy, Activity as ActivityIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeSuggestions } from '../services/geminiService';
import { Suggestion, Activity, User, Customer, WorkoutLog, AttendanceRecord } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isClient = user.role === 'client';
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [stats, setStats] = useState({
    todayCheckins: 0,
    newCustomers: 0,
    activeMembers: 0,
    suggestionsCount: 0,
    clientStreak: 0,
    clientCalories: 0,
    clientLevel: 'Novato'
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('Analizando tu progreso...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user.id, isClient]);

  const loadDashboardData = () => {
    // 1. Cargar datos de las "Tablas"
    const customers: Customer[] = JSON.parse(localStorage.getItem('titan_customers') || '[]');
    const attendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('titan_attendance') || '[]');
    const workoutLogs: WorkoutLog[] = JSON.parse(localStorage.getItem('titan_workout_logs') || '[]');
    const suggestions: Suggestion[] = JSON.parse(localStorage.getItem('titan_suggestions') || '[]');

    if (!isClient) {
      // LÓGICA STAFF
      const todayInscriptions = customers.filter(c => c.registrationDate === todayStr).length;
      const todayAttendance = new Set(attendance.filter(a => a.timestamp.startsWith(todayStr)).map(a => a.employeeId)).size;
      const activeMembersCount = customers.filter(c => c.status === 'active').length;

      setStats(prev => ({
        ...prev,
        todayCheckins: todayAttendance,
        newCustomers: todayInscriptions,
        activeMembers: activeMembersCount,
        suggestionsCount: suggestions.length
      }));

      // Chart: Inscripciones por mes (Simulado con datos actuales)
      setChartData([
        { name: 'Sem 1', v: todayInscriptions + 2 },
        { name: 'Sem 2', v: Math.max(0, todayInscriptions - 1) },
        { name: 'Sem 3', v: activeMembersCount / 4 },
        { name: 'Sem 4', v: todayAttendance }
      ]);
    } else {
      // LÓGICA CLIENTE
      const myLogs = workoutLogs.filter(l => l.userId === user.id);
      
      // Calcular racha
      let streak = 0;
      const dates = [...new Set(myLogs.map(l => l.date.split('T')[0]))].sort().reverse();
      let checkDate = new Date();
      
      for (let i = 0; i < dates.length; i++) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calcular Calorías de Hoy (Estimación por volumen)
      const todayLog = myLogs.find(l => l.date.split('T')[0] === todayStr);
      let totalCalories = 0;
      if (todayLog) {
        todayLog.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.completed) totalCalories += (set.weight * set.reps * 0.1); // Fórmula simple de esfuerzo
          });
        });
      }

      const level = streak > 15 ? 'Titán Oro' : streak > 7 ? 'Titán Plata' : 'Atleta';

      setStats(prev => ({
        ...prev,
        clientStreak: streak,
        clientCalories: Math.round(totalCalories),
        clientLevel: level
      }));

      // Gráfica de volumen por entrenamiento
      const last4 = myLogs.slice(0, 4).reverse().map((l, i) => ({
        name: `Sess ${i + 1}`,
        v: l.exercises.length * 5
      }));
      setChartData(last4.length ? last4 : [{name: 'Sin datos', v: 0}]);

      // Actividades (basado en rutina activa)
      if (user.activeRoutineId) {
        const routines = JSON.parse(localStorage.getItem('titan_routines') || '[]');
        const routine = routines.find((r: any) => r.id === user.activeRoutineId);
        if (routine) {
          const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][new Date().getDay()];
          const todayEx = routine.schedule[dayName] || [];
          setActivities(todayEx.slice(0, 3).map((ex: any) => ({
            id: ex.id,
            title: ex.name,
            dueDate: 'Hoy',
            completed: todayLog?.exercises.some(e => e.exerciseId === ex.id) || false
          })));
        }
      }
    }

    fetchAIAnalysis(isClient ? "cliente" : "admin");
  };

  const fetchAIAnalysis = async (context: string) => {
    setIsAnalyzing(true);
    try {
      const insight = await analyzeSuggestions([]); // El servicio ya maneja el prompt internamente
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Mantén la disciplina. El éxito es la suma de pequeños esfuerzos repetidos.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
            {isClient ? `¡Hola, ${user.name.split(' ')[0]}!` : 'Panel de Control'}
          </h2>
          <p className="text-slate-500 font-medium">Estado del gimnasio al {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isClient ? (
          <>
            <KpiCard icon={<Flame size={24} />} label="Racha Actual" value={`${stats.clientStreak} Días`} trend={stats.clientStreak > 0 ? "¡Fuego activo!" : "Empieza hoy"} color="rose" />
            <KpiCard icon={<Trophy size={24} />} label="Rango" value={stats.clientLevel} trend="Sube de nivel entrenando" color="amber" />
            <KpiCard icon={<ActivityIcon size={24} />} label="Calorías Hoy" value={stats.clientCalories} trend="Estimado esfuerzo" color="emerald" />
            <KpiCard icon={<Calendar size={24} />} label="Próximo Pago" value="15 Dic" trend="Membresía Activa" color="blue" />
          </>
        ) : (
          <>
            <KpiCard icon={<Users size={24} />} label="Asistencia Hoy" value={stats.todayCheckins} trend="Atletas únicos" color="emerald" />
            <KpiCard icon={<UserPlus size={24} />} label="Inscritos Hoy" value={stats.newCustomers} trend="Nuevos Titanes" color="blue" />
            <KpiCard icon={<ClipboardList size={24} />} label="Atletas Activos" value={stats.activeMembers} trend="Total en sistema" color="amber" />
            <KpiCard icon={<MessageSquare size={24} />} label="Sugerencias" value={stats.suggestionsCount} trend="Pendientes" color="rose" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter italic">
            {isClient ? 'Intensidad de Sesiones' : 'Crecimiento de Comunidad'}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="v" radius={[10, 10, 0, 0]} fill={isClient ? "#ef4444" : "#10b981"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Tareas de Hoy</h3>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map(activity => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-500/20 transition-all">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${activity.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                  {activity.completed && <CheckSquare size={16} className="text-white" />}
                </div>
                <div>
                  <p className={`font-bold text-sm ${activity.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{activity.title}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase">{activity.dueDate}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <Calendar className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 font-bold text-xs uppercase">Sin actividades pendientes</p>
              </div>
            )}
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
            {isAnalyzing ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-xs font-black uppercase tracking-widest">Sincronizando con el Olimpo...</p>
              </div>
            ) : (
              <p className="leading-relaxed font-medium text-sm sm:text-base italic">"{aiInsight}"</p>
            )}
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
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-emerald-500/20 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</h3>
        </div>
      </div>
      <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest w-fit border border-slate-100">{trend}</div>
    </div>
  );
};

export default Dashboard;
