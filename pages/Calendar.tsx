
import React from 'react';
import { Calendar as CalendarIcon, Clock, User, MapPin, Key, Plus, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const EVENTS = [
  { id: '1', time: '09:00', title: 'Visita: Apartamento Moema', client: 'Marina Santos', broker: 'André Luiz', status: 'CONFIRMED' },
  { id: '2', time: '11:30', title: 'Entrega de Chaves: Studio Itaim', client: 'Carlos Silva', broker: 'André Luiz', status: 'PENDING' },
  { id: '3', time: '14:00', title: 'Vistoria: Casa Alphaville', client: 'Bruno Silveira', broker: 'Patrícia G.', status: 'CONFIRMED' },
  { id: '4', time: '16:00', title: 'Assinatura: Res. Jardins', client: 'Lucia Gomes', broker: 'André Luiz', status: 'CANCELLED' },
];

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda & Logística</h1>
          <p className="text-slate-500">Gestão de visitas, reuniões e fluxo de chaves.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            <Plus size={18} /> Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Date Picker Sidebar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Outubro 2023</h3>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-slate-50 rounded border border-slate-200"><ChevronLeft size={16}/></button>
              <button className="p-1 hover:bg-slate-50 rounded border border-slate-200"><ChevronRight size={16}/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-400 uppercase mb-2">{d}</span>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <button key={i} className={`h-8 w-8 text-xs font-bold rounded-lg transition-colors ${i + 1 === 18 ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Logística de Chaves</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Key size={14} className="text-amber-500"/> AP-001
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase">Com Corretor</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Key size={14} className="text-emerald-500"/> ST-012
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">Na Sede</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon size={20} className="text-indigo-600"/> Compromissos de Hoje
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">Quarta-feira, 18 de Outubro</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {EVENTS.map(event => (
              <div key={event.id} className="flex gap-6 group">
                <div className="w-16 pt-1">
                  <p className="text-sm font-black text-slate-900">{event.time}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">AM</p>
                </div>
                <div className={`flex-1 p-4 rounded-2xl border-l-4 shadow-sm transition-all hover:shadow-md ${
                  event.status === 'CONFIRMED' ? 'bg-indigo-50/30 border-l-indigo-600 border-indigo-100' :
                  event.status === 'PENDING' ? 'bg-amber-50/30 border-l-amber-500 border-amber-100' :
                  'bg-slate-50/30 border-l-slate-400 border-slate-100 opacity-60'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{event.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><User size={12}/> {event.client}</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/> Local: Imóvel</span>
                        <span className="flex items-center gap-1"><Phone size={12} className="text-emerald-500"/> WhatsApp</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4 hidden md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Corretor</p>
                        <p className="text-xs font-bold text-slate-700">{event.broker}</p>
                      </div>
                      <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                        <Plus size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
