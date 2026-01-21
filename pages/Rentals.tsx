
import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Search, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Plus,
  Zap,
  HandCoins,
  Receipt,
  Printer
} from 'lucide-react';
import { paymentEvents } from '../services/paymentService';

const MOCK_RENTALS = [
  { id: '1', property: 'Casa Vila Betel', tenant: 'Marina Santos', owner: 'Luís Gustavo', value: 1200, dueDay: 10, status: 'PAID', lastPayment: '10/10/2023', method: 'PIX_AUTO' },
  { id: '2', property: 'Apartamento Centro', tenant: 'Carlos Silva', owner: 'Helena Costa', value: 950, dueDay: 5, status: 'PENDING', lastPayment: '05/09/2023', method: null },
  { id: '3', property: 'Sala Comercial Vila Rica', tenant: 'Roberto Lima', owner: 'Pedro Simão', value: 1800, dueDay: 15, status: 'OVERDUE', lastPayment: '15/08/2023', method: null },
];

const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState(MOCK_RENTALS);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (confirm("Confirmar recebimento manual deste aluguel em Guaranésia?")) {
      setRentals(prev => prev.map(r => 
        r.id === id ? { ...r, status: 'PAID', method: 'MANUAL', lastPayment: 'Hoje' } : r
      ));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Locações em Guaranésia</h1>
          <p className="text-slate-500 font-medium">Monitoramento de aluguéis e repasses.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">
            <Printer size={18} /> Imprimir Relatório
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
            <Plus size={18} /> Nova Locação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Total Recebido (Mês)</p>
          <p className="text-3xl font-black text-slate-900">R$ 18.500</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Inadimplência Local</p>
          <p className="text-3xl font-black text-rose-600">R$ 1.800</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Automação Pix</p>
          <p className="text-3xl font-black text-indigo-600">74%</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between no-print">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Inquilino ou imóvel..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Imóvel / Inquilino</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Método</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.filter(r => r.tenant.toLowerCase().includes(searchTerm.toLowerCase())).map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${rental.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Key size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{rental.property}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">{rental.tenant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-900">R$ {rental.value.toLocaleString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${
                      rental.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50'
                    }`}>
                      {rental.status === 'PAID' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {rental.method === 'PIX_AUTO' ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase">
                        <Zap size={12} /> Pix Auto
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-400 uppercase">Manual</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right no-print">
                    <button onClick={() => handleManualPayment(rental.id)} className="p-2 text-slate-300 hover:text-indigo-600"><MoreVertical size={18} /></button>
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
