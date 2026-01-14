
import React, { useState } from 'react';
import { 
  Key, 
  Search, 
  Calendar, 
  DollarSign, 
  ArrowRightLeft, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Filter,
  X,
  Plus
} from 'lucide-react';

const MOCK_RENTALS = [
  { id: '1', property: 'Apartamento Moema', tenant: 'Marina Santos', owner: 'Ricardo Almeida', value: 4500, dueDay: 10, status: 'PAID', lastPayment: '10/10/2023' },
  { id: '2', property: 'Casa Vila Mariana', tenant: 'Carlos Silva', owner: 'Helena Costa', value: 3200, dueDay: 5, status: 'PENDING', lastPayment: '05/09/2023' },
  { id: '3', property: 'Studio Itaim', tenant: 'Roberto Lima', owner: 'Ricardo Almeida', value: 2800, dueDay: 15, status: 'OVERDUE', lastPayment: '15/08/2023' },
];

const Rentals: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAction = (type: string, name: string) => {
    const actions: any = {
      repassar: `Iniciando processamento de repasse para o proprietário do imóvel: ${name}`,
      details: `Abrindo extrato detalhado da locação: ${name}`,
      filter: "Filtros avançados: Por Proprietário, Por Vencimento, Por Inadimplência."
    };
    alert(actions[type]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Locações</h1>
          <p className="text-slate-500">Controle o fluxo de aluguéis e repasses aos proprietários.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Nova Locação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-all group cursor-pointer">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Recebido (Mês)</p>
          <p className="text-2xl font-black text-slate-900">R$ 42.500,00</p>
          <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold">
            <CheckCircle size={14} className="mr-1" /> 85% dos contratos liquidados
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-rose-100 transition-all group cursor-pointer">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Inadimplência</p>
          <p className="text-2xl font-black text-rose-600">R$ 5.800,00</p>
          <div className="mt-4 flex items-center text-rose-600 text-xs font-bold">
            <AlertCircle size={14} className="mr-1" /> 4 contratos em atraso crítico
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-100 transition-all group cursor-pointer">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pendente de Repasse</p>
          <p className="text-2xl font-black text-amber-600">R$ 12.400,00</p>
          <div className="mt-4 flex items-center text-amber-600 text-xs font-bold">
            <ArrowRightLeft size={14} className="mr-1" /> Aguardando conciliação banco
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por imóvel, inquilino ou proprietário..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleAction('filter', '')}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Filter size={16} /> Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade / Inquilino</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluguel / Venc.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Últ. Liquidação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RENTALS.filter(r => r.tenant.toLowerCase().includes(searchTerm.toLowerCase())).map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Key size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rental.property}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rental.tenant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">R$ {rental.value.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase">Dia {rental.dueDay} de cada mês</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                      rental.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      rental.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {rental.status === 'PAID' ? 'Liquidado' : rental.status === 'PENDING' ? 'Aberto' : 'Inadimplente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Calendar size={12} className="text-indigo-400" /> {rental.lastPayment}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAction('repassar', rental.property)}
                        className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
                      >
                        Repassar
                      </button>
                      <button 
                        onClick={() => handleAction('details', rental.property)}
                        className="p-2 text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-xl">Nova Locação</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 active:scale-95 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imóvel (Código ou Ref)</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: AP-001" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquilino</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Selecione o Cliente...</option>
                    <option>Marina Santos</option>
                    <option>Carlos Silva</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dia de Vencimento</label>
                  <input type="number" min="1" max="31" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10" />
                </div>
              </div>
              <button 
                onClick={() => { alert('Locação vinculada com sucesso!'); setShowModal(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Ativar Contrato de Locação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
