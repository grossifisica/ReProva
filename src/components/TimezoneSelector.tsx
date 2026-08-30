import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const timezones = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/New_York', label: 'Nova York (GMT-5)' },
  { value: 'Europe/London', label: 'Londres (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Asia/Tokyo', label: 'Tóquio (GMT+9)' },
];

interface TimezoneSelectorProps {
  timezone: string;
  setTimezone: (timezone: string) => void;
}

export default function TimezoneSelector({ timezone, setTimezone }: TimezoneSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configurar Fuso Horário</h2>
        <p className="text-zinc-400 mt-1">Selecione o fuso horário para o relógio da prova.</p>
      </div>

      <Card className="border-2 border-zinc-800 bg-zinc-900/80 text-zinc-100">
        <CardHeader className="bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 text-zinc-950 p-2 rounded-xl">
              <Globe className="text-zinc-950" size={20} />
            </div>
            <CardTitle className="text-lg text-white">Fuso Horário Atual</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label htmlFor="timezone-select" className="text-zinc-300">Selecione uma região</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timezones.map((tz) => (
                <button
                  key={tz.value}
                  onClick={() => setTimezone(tz.value)}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                    timezone === tz.value
                      ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-bold">{tz.label.split(' (')[0]}</span>
                  <span className={`text-xs ${timezone === tz.value ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    {tz.label.split(' (')[1].replace(')', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
