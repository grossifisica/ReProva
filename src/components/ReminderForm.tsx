import { Reminder } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, Trash2, Plus, Clock } from 'lucide-react';

interface ReminderFormProps {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
}

export default function ReminderForm({ reminders, setReminders }: ReminderFormProps) {
  const addReminder = () => {
    if (reminders.length >= 3) return;
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      time: '12:00',
      label: '',
      alwaysVisible: false,
    };
    setReminders([...reminders, newReminder]);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Configurar Lembretes</h2>
          <p className="text-zinc-400 mt-1">Adicione até 3 avisos para os alunos durante a prova.</p>
        </div>
        <Button 
          onClick={addReminder} 
          disabled={reminders.length >= 3}
          className="rounded-full px-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="grid gap-6">
        {reminders.map((reminder, index) => (
          <Card key={reminder.id} className="overflow-hidden border-2 border-zinc-800 bg-zinc-900/80 text-zinc-100 transition-all hover:border-zinc-700">
            <CardHeader className="pb-4 bg-zinc-900 border-b border-zinc-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <CardTitle className="text-lg text-white">Lembrete {index + 1}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeReminder(reminder.id)}
                className="text-zinc-400 hover:text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`time-${reminder.id}`} className="flex items-center gap-2 text-zinc-300">
                    <Clock size={14} /> Horário Previsto
                  </Label>
                  <Input
                    id={`time-${reminder.id}`}
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminder(reminder.id, { time: e.target.value })}
                    className="font-mono text-lg bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`label-${reminder.id}`} className="flex items-center gap-2 text-zinc-300">
                    <Bell size={14} /> Título do Aviso
                  </Label>
                  <Input
                    id={`label-${reminder.id}`}
                    placeholder="Ex: Faltam 30 minutos"
                    value={reminder.label}
                    onChange={(e) => updateReminder(reminder.id, { label: e.target.value })}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">Sempre Visível</Label>
                  <p className="text-sm text-zinc-400">
                    Exibe uma contagem regressiva na tela do relógio.
                  </p>
                </div>
                <Switch
                  checked={reminder.alwaysVisible}
                  onCheckedChange={(checked) => updateReminder(reminder.id, { alwaysVisible: checked })}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl border-zinc-800 bg-zinc-900/30">
            <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-zinc-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-zinc-200">Nenhum lembrete configurado</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">
              Clique no botão acima para adicionar um aviso que será projetado na lousa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
