/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClockDisplay from '@/components/ClockDisplay';
import ReminderForm from '@/components/ReminderForm';
import TimezoneSelector from '@/components/TimezoneSelector';
import { Reminder } from '@/types';
import { Clock, Settings, Maximize2, Minimize2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('exam-reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('exam-timezone') || 'America/Sao_Paulo';
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('exam-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('exam-timezone', timezone);
  }, [timezone]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleAcknowledge = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, acknowledged: !r.acknowledged } : r));
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300 dark">
      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col">
        <header className="p-6 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 text-zinc-950 p-2 rounded-xl">
              <Clock className="text-zinc-950" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">ReProva!</h1>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Relógio de Prova - Prof. Grossi</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFullscreen}
              className="rounded-full border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Tabs defaultValue="clock" className="flex-1 flex flex-col">
            <TabsContent value="clock" className="flex-1 m-0 focus-visible:outline-none">
              <ClockDisplay reminders={reminders} onAcknowledge={toggleAcknowledge} timezone={timezone} />
            </TabsContent>

            <TabsContent value="reminders" className="flex-1 m-0 focus-visible:outline-none bg-zinc-900/30">
              <ReminderForm reminders={reminders} setReminders={setReminders} />
            </TabsContent>

            <TabsContent value="timezone" className="flex-1 m-0 focus-visible:outline-none bg-zinc-900/30">
              <TimezoneSelector timezone={timezone} setTimezone={setTimezone} />
            </TabsContent>

            <div className="flex justify-center p-4 bg-zinc-900/50 border-t border-zinc-800/50 mt-auto">
              <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-zinc-900 border border-zinc-800 rounded-full">
                <TabsTrigger value="clock" className="rounded-full text-zinc-400 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950 data-[state=active]:font-bold transition-all">
                  <Clock className="mr-2 h-4 w-4" /> Relógio
                </TabsTrigger>
                <TabsTrigger value="reminders" className="rounded-full text-zinc-400 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950 data-[state=active]:font-bold transition-all">
                  <Settings className="mr-2 h-4 w-4" /> Lembretes
                </TabsTrigger>
                <TabsTrigger value="timezone" className="rounded-full text-zinc-400 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-950 data-[state=active]:font-bold transition-all">
                  <Globe className="mr-2 h-4 w-4" /> Fuso
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </main>

        <footer className="p-6 text-center text-zinc-500 text-sm border-t border-zinc-900">
          <p>© {new Date().getFullYear()} ReProva! • Design para Educação</p>
        </footer>
      </div>
    </div>
  );
}

