
import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeftRight, 
  FileSpreadsheet,
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Paperclip,
  ShieldCheck,
  FileCheck,
  Banknote,
  Printer,
  Zap,
  HandCoins
} from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: '1', date: '12/10/2023', desc: 'Repasse Aluguel AP-001', value: 3800, type: 'EXPENSE', category: 'Repasses', status: 'PAID', costCenter: 'Locação', method: 'MANUAL', reconciled: true },
  { id: '2', date: '12/10/2023', desc: 'Comissão Venda CA-042', value: 85000, type: 'INCOME', category: 'Comissões', status: 'PAID', costCenter: 'Vendas', method: 'MANUAL', reconciled: true },
  { id: '3', date: 'Hoje', desc: 'Recebimento Aluguel AP-001', value: 4500, type: 'INCOME', category: 'Aluguéis', status: 'PAID', costCenter: 'Locação', method: 'PIX_AUTO', reconciled: true },
  { id: '4', date: '10/10/2023', desc: 'Conta de Energia (Sede)', value: 1240.50, type: 'EXPENSE', category: 'Custos Fixos', status: 'PENDING', costCenter: 'Administrativo', method: 'MANUAL', reconciled: false },
];

const Financial: React.FC = () => {
  const [view, setView] = useState<'flow' | 'payable' | 'receivable' | 'fiscal'>('flow');

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fluxo de Caixa</h1>
          <p className="text-slate-500 font-medium">Controle unificado de receitas, despesas e repasses.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <Printer size={20} />
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20}/></div>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">+12%</span>
          </div>
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Receita Mensal</h3>
          <p className="text-2xl font-black text-slate-900">R$ 254.900</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><TrendingDown size={20}/></div>
             <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">-4%</span>
          </div>
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Despesas / Repasses</h3>
          <p className="text-2xl font-black text-slate-900">R$ 112.450</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2.5 bg-white/10 rounded-xl"><Banknote size={20}/></div>
             <Zap size={20} className="text-white/40 animate-pulse"/>
          </div>
          <h3 className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-1">Lucro Líquido</h3>
          <p className="text-2xl font-black">R$ 142.450</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2.5 bg-white/10 rounded-xl"><ShieldCheck size={20}/></div>
          </div>
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fundo Reserva</h3>
          <p className="text-2xl font-black">R$ 842.100</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-indigo-600"/> Livro Caixa & Auditoria
          </h3>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Exportar DIMOB</button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400"><Filter size={18}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lançamento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo / Origem</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Conciliação</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{t.desc}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {t.method === 'PIX_AUTO' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black border border-indigo-100 uppercase tracking-wider">
                        <Zap size={10} /> Gateway Pix
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black border border-slate-200 uppercase tracking-wider">
                        <HandCoins size={10} /> Depósito Manual
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} R$ {t.value.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border tracking-wider ${
                      t.reconciled ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {t.reconciled ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      {t.reconciled ? 'Conciliado' : 'Aguardando'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2.5 text-slate-300 hover:text-indigo-600 transition-all"><Paperclip size={18}/></button>
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

export default Financial;
