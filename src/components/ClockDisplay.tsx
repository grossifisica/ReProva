import { useState, useEffect } from 'react';
import { format, parse, differenceInSeconds, isAfter, isBefore, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Reminder } from '@/types';
import { Bell, Clock as ClockIcon, Timer } from 'lucide-react';

interface ClockDisplayProps {
  reminders: Reminder[];
  onAcknowledge: (id: string) => void;
  timezone: string;
}

export default function ClockDisplay({ reminders, onAcknowledge, timezone }: ClockDisplayProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get Time for display
  const timeString = now.toLocaleTimeString('pt-BR', { 
    timeZone: timezone, 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const dateString = now.toLocaleDateString('pt-BR', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // For calculations, we need a date object that represents the current time in the selected timezone
  const getSelectedNow = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value);
    return new Date(getPart('year'), getPart('month') - 1, getPart('day'), getPart('hour'), getPart('minute'), getPart('second'));
  };

  const selectedNow = getSelectedNow();

  const getReminderStatus = (reminder: Reminder) => {
    if (!reminder.time) return null;

    const [hours, minutes] = reminder.time.split(':').map(Number);
    let reminderDate = new Date(selectedNow);
    reminderDate.setHours(hours, minutes, 0, 0);

    const diffSeconds = differenceInSeconds(reminderDate, selectedNow);
    
    if (reminder.alwaysVisible) {
      if (diffSeconds > 0) {
        const h = Math.floor(diffSeconds / 3600);
        const m = Math.floor((diffSeconds % 3600) / 60);
        const s = diffSeconds % 60;
        return {
          type: 'countdown',
          text: `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
          label: reminder.label,
          originalTime: reminder.time
        };
      } else if (diffSeconds > -3600) {
        return {
          type: 'active',
          text: reminder.label || 'AGORA!',
          label: 'AVISO',
          originalTime: reminder.time
        };
      }
    } else {
      if (diffSeconds <= 0 && diffSeconds > -3600) {
        return {
          type: 'active',
          text: reminder.label || 'ALERTA',
          label: 'AVISO',
          originalTime: reminder.time
        };
      }
    }
    
    return null;
  };

  const activeReminders = reminders
    .map(r => ({ ...r, status: getReminderStatus(r) }))
    .filter(r => r.status !== null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 space-y-12">
      {/* Main Clock */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter font-mono text-white tabular-nums drop-shadow-sm">
          {timeString}
        </h1>
        <p className="text-2xl text-zinc-400 mt-4 font-light uppercase tracking-widest">
          {dateString}
        </p>
      </motion.div>

      {/* Reminders Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <AnimatePresence mode="popLayout">
          {activeReminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => reminder.status?.type === 'active' && onAcknowledge(reminder.id)}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center space-y-3 cursor-pointer transition-all ${
                reminder.status?.type === 'active' 
                  ? reminder.acknowledged 
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-950/50' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-90">
                {reminder.status?.type === 'countdown' ? <Timer size={18} /> : <Bell size={18} />}
                <span>{reminder.status?.type === 'countdown' ? reminder.label : reminder.status?.label}</span>
              </div>
              
              <div className="text-5xl font-black font-mono tabular-nums break-words w-full">
                {reminder.status?.text}
              </div>
              
              {reminder.status?.type === 'active' && (
                <div className="text-sm font-mono bg-white/10 px-3 py-1 rounded-full text-zinc-200">
                  Horário: {reminder.time}
                </div>
              )}
              
              {reminder.status?.type === 'countdown' && (
                <div className="text-xs text-zinc-400 font-medium uppercase tracking-widest">
                  Tempo Restante
                </div>
              )}
              {reminder.status?.type === 'active' && !reminder.acknowledged && (
                <div className="text-[10px] text-zinc-200 font-medium uppercase tracking-widest">
                  Clique para silenciar
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {activeReminders.length === 0 && (
        <div className="text-zinc-400 font-mono text-sm uppercase tracking-widest opacity-50">
          Nenhum lembrete ativo no momento
        </div>
      )}
    </div>
  );
}
