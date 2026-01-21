
import React, { useState, useEffect } from 'react';
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
  Plus,
  CheckCircle2,
  Zap,
  HandCoins,
  Receipt,
  Printer
} from 'lucide-react';
import { paymentEvents } from '../services/paymentService';

const MOCK_RENTALS = [
  { id: '1', property: 'Apartamento Moema', tenant: 'Marina Santos', owner: 'Ricardo Almeida', value: 4500, dueDay: 10, status: 'PAID', lastPayment: '10/10/2023', method: 'PIX_AUTO' },
  { id: '2', property: 'Casa Vila Mariana', tenant: 'Carlos Silva', owner: 'Helena Costa', value: 3200, dueDay: 5, status: 'PENDING', lastPayment: '05/09/2023', method: null },
  { id: '3', property: 'Studio Itaim', tenant: 'Roberto Lima', owner: 'Ricardo Almeida', value: 2800, dueDay: 15, status: 'OVERDUE', lastPayment: '15/08/2023', method: null },
];

const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState(MOCK_RENTALS);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Escutar pagamentos Pix automáticos para atualizar a lista em tempo real
  useEffect(() => {
    const handleAutoPayment = (e: any) => {
      const { propertyCode } = e.detail;
      setRentals(prev => prev.map(r => 
        r.property.includes(propertyCode) || propertyCode.includes(r.property)
          ? { ...r, status: 'PAID', method: 'PIX_AUTO', lastPayment: 'Hoje (Automático)' }
          : r
      ));
    };
    paymentEvents.addEventListener('payment_confirmed', handleAutoPayment);
    return () => paymentEvents.removeEventListener('payment_confirmed', handleAutoPayment);
  }, []);

  const handleManualPayment = (id: string) => {
    if (confirm("Confirmar recebimento manual deste aluguel? Isso gerará um recibo e baixará o débito.")) {
      setRentals(prev => prev.map(r => 
        r.id === id ? { ...r, status: 'PAID', method: 'MANUAL', lastPayment: 'Hoje' } : r
      ));
    }
  };

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Locações</h1>
          <p className="text-slate-500 font-medium">Controle o fluxo de aluguéis e baixas de pagamentos.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 shadow-sm uppercase text-[10px] tracking-widest"
          >
            <Printer size={18} /> Imprimir Relatório
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 uppercase text-[10px] tracking-widest"
          >
            <Plus size={18} /> Nova Locação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Total Recebido (Mês)</p>
          <p className="text-3xl font-black text-slate-900">R$ 42.500</p>
          <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-black uppercase">
            <CheckCircle size={14} className="mr-1" /> 85% Liquidados
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Atrasos / Inadimplência</p>
          <p className="text-3xl font-black text-rose-600">R$ 5.800</p>
          <div className="mt-4 flex items-center text-rose-600 text-[10px] font-black uppercase">
            <AlertCircle size={14} className="mr-1" /> 2 Críticos
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Pagamentos Automáticos (Pix)</p>
          <p className="text-3xl font-black text-indigo-600">62%</p>
          <div className="mt-4 flex items-center text-indigo-600 text-[10px] font-black uppercase">
            <Zap size={14} className="mr-1" /> Via Portal do Cliente
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30 no-print">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por imóvel, inquilino ou proprietário..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contrato / Inquilino</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mensalidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status da Baixa</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Método</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.filter(r => r.tenant.toLowerCase().includes(searchTerm.toLowerCase())).map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl transition-all shadow-sm ${rental.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Key size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{rental.property}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rental.tenant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-900">R$ {rental.value.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase">Venc. Todo dia {rental.dueDay}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      rental.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      rental.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {rental.status === 'PAID' ? 'Liquidado' : rental.status === 'PENDING' ? 'Aberto' : 'Em Atraso'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {rental.method === 'PIX_AUTO' ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-wider">
                        <Zap size={12} /> Pix Automático
                      </span>
                    ) : rental.method === 'MANUAL' ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-wider">
                        <HandCoins size={12} /> Baixa Manual
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Aguardando...</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right no-print">
                    <div className="flex items-center justify-end gap-2">
                      {rental.status !== 'PAID' ? (
                        <button 
                          onClick={() => handleManualPayment(rental.id)}
                          className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          <Receipt size={14} /> Dar Baixa
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction('repassar', rental.property)}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-indigo-600 hover:border-indigo-600 transition-all"
                        >
                          Repassar
                        </button>
                      )}
                      <button className="p-2.5 text-slate-300 hover:text-slate-900 transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rentals;
