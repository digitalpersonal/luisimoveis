
import React from 'react';
import { Wrench, Search, AlertCircle, Clock, CheckCircle2, ChevronRight, Plus, Hammer, User } from 'lucide-react';

const MOCK_MAINTENANCE = [
  { id: '1', property: 'Apartamento Moema', title: 'Vazamento na Cozinha', category: 'Hidráulica', status: 'URGENT', date: 'Há 45 min' },
  { id: '2', property: 'Studio Itaim', title: 'Curto circuito tomada sala', category: 'Elétrica', status: 'IN_PROGRESS', date: 'Hoje, 09:30' },
  { id: '3', property: 'Casa Alphaville', title: 'Reparo no Portão Eletrônico', category: 'Serralheria', status: 'WAITING_APPROVAL', date: 'Ontem' },
  { id: '4', property: 'Residencial Jardins', title: 'Pintura área externa', category: 'Pintura', status: 'DONE', date: '12/10/2023' },
];

const Maintenance: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const map: any = {
      'URGENT': { label: 'Urgente', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: <AlertCircle size={12}/> },
      'IN_PROGRESS': { label: 'Em Execução', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: <Hammer size={12}/> },
      'WAITING_APPROVAL': { label: 'Aguardando Proprietário', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Clock size={12}/> },
      'DONE': { label: 'Concluído', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle2 size={12}/> },
    };
    const config = map[status] || { label: status, color: 'bg-slate-50' };
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manutenção & Reparos</h1>
          <p className="text-slate-500">Gestão de chamados técnicos para imóveis administrados.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Novo Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Chamados Abertos</p>
          <p className="text-3xl font-black text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Custo Médio (Mês)</p>
          <p className="text-3xl font-black text-indigo-600">R$ 4.250,00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Satisfação Inquilino</p>
          <p className="text-3xl font-black text-emerald-600">4.8/5.0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Filtrar chamados..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500"><Hammer size={18}/></button>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_MAINTENANCE.map((item) => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 transition-colors group">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <Wrench className="text-slate-400 group-hover:text-indigo-600" size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{item.property}</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1 uppercase tracking-wider font-bold text-[10px]">{item.category}</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                  <span>Aberto em {item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsável</p>
                  <p className="text-xs font-bold text-slate-700">Eng. Marcos Paulo</p>
                </div>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
