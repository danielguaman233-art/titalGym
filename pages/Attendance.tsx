
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, User } from '../types';
import { MapPin, Clock, Fingerprint, Calendar, ArrowRightLeft, Info } from 'lucide-react';

interface AttendanceProps {
  currentUser: User;
}

const Attendance: React.FC<AttendanceProps> = ({ currentUser }) => {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Cargar historial persistido
    const saved = localStorage.getItem('titan_attendance');
    if (saved) {
      const allHistory: AttendanceRecord[] = JSON.parse(saved);
      // Solo mostrar los del usuario actual en esta vista
      setHistory(allHistory.filter(r => r.employeeId === currentUser.id));
    }

    return () => clearInterval(timer);
  }, [currentUser.id]);

  const handleAttendance = () => {
    setStatus('loading');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const type = (history[0]?.type === 'in') ? 'out' : 'in';
          const newRecord: AttendanceRecord = {
            id: Math.random().toString(36).substr(2, 9),
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            type: type,
            timestamp: new Date().toISOString(),
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          };

          // Guardar en el global de localStorage
          const saved = localStorage.getItem('titan_attendance');
          const allHistory = saved ? JSON.parse(saved) : [];
          const updatedAll = [newRecord, ...allHistory];
          localStorage.setItem('titan_attendance', JSON.stringify(updatedAll));

          // Actualizar vista local
          setHistory([newRecord, ...history]);
          setStatus('success');
          setTimeout(() => setStatus('idle'), 2000);
        },
        () => setStatus('error')
      );
    } else {
      setStatus('error');
    }
  };

  const isCheckedIn = history[0]?.type === 'in';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Asistencia Personal</h2>
        <p className="text-slate-500 text-sm sm:text-base">Registra tu jornada laboral validando tu ubicación</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6">
            <Clock size={32} />
          </div>

          <h3 className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tighter">
            {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-8">
            {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
          </p>

          <button 
            onClick={handleAttendance}
            disabled={status === 'loading'}
            className={`w-full max-w-xs flex items-center justify-center gap-3 py-4 sm:py-6 rounded-2xl font-black text-lg sm:text-xl transition-all active:scale-95 shadow-2xl ${
              isCheckedIn 
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
            }`}
          >
            {status === 'loading' ? 'Validando GPS...' : isCheckedIn ? 'Marcar Salida' : 'Marcar Entrada'}
          </button>
          
          {status === 'error' && (
            <p className="mt-4 text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Error de geolocalización
            </p>
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" />
              Mis Logs de Hoy
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {history.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="font-bold text-sm">No hay registros hoy</p>
              </div>
            ) : (
              history.map(record => (
                <div key={record.id} className="p-6 border-b border-slate-50 flex items-center justify-between last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${record.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <ArrowRightLeft size={20} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase tracking-tighter">{record.type === 'in' ? 'Entrada' : 'Salida'}</p>
                      <p className="text-xs text-slate-400 font-bold">{new Date(record.timestamp).toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <MapPin size={10} /> GPS OK
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
