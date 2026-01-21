
import React from 'react';
import { 
  TrendingUp, 
  Search, 
  ChevronRight, 
  DollarSign, 
  User, 
  Briefcase,
  Clock,
  CheckCircle2
} from 'lucide-react';

const MOCK_SALES = [
  { id: '1', title: 'Cobertura Jardins', client: 'Marina Santos', broker: 'André Luiz', value: 4500000, stage: 'PROPOSAL', date: '12/05/2023' },
  { id: '2', title: 'Casa Alphaville', client: 'João Ferreira', broker: 'Patrícia Gomes', value: 3450000, stage: 'NEGOTIATION', date: '08/05/2023' },
  { id: '3', title: 'Apartamento Moema', client: 'Carlos Silva', broker: 'André Luiz', value: 1250000, stage: 'CONTRACT_SIGNED', date: '01/05/2023' },
];

const Sales: React.FC = () => {
  const getStageBadge = (stage: string) => {
    const stages: any = {
      'PROPOSAL': { label: 'Proposta', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      'NEGOTIATION': { label: 'Em Negociação', color: 'bg-amber-50 text-amber-700 border-amber-100' },
      'CONTRACT_SIGNED': { label: 'Contrato Assinado', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      'FINISHED': { label: 'Concluído', color: 'bg-slate-50 text-slate-700 border-slate-200' },
    };
    const { label, color } = stages[stage] || { label: stage, color: 'bg-slate-100 text-slate-600' };
    return <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${color}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendas</h1>
          <p className="text-slate-500">Acompanhamento de propostas, fechamentos e comissões.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Nova Venda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Propostas</p>
            <p className="text-xl font-black">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Em Negociação</p>
            <p className="text-xl font-black">5</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Vendido (Mês)</p>
            <p className="text-xl font-black">R$ 5.2M</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Ticket Médio</p>
            <p className="text-xl font-black">R$ 1.8M</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Pipeline de Vendas</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_SALES.map((sale) => (
            <div key={sale.id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900 truncate">{sale.title}</h4>
                  {getStageBadge(sale.stage)}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500"><User size={12}/> {sale.client}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Briefcase size={12}/> Corretor: {sale.broker}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">Postado em {sale.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Valor Negociado</p>
                  <p className="text-lg font-black text-slate-900">R$ {sale.value.toLocaleString('pt-BR')}</p>
                </div>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all">
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

export default Sales;
