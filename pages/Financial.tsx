
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
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
  Printer
} from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: '1', date: '12/10/2023', desc: 'Repasse Aluguel AP-001', value: 3800, type: 'EXPENSE', category: 'Repasses', status: 'PAID', costCenter: 'Locação', hasVoucher: true, reconciled: true },
  { id: '2', date: '12/10/2023', desc: 'Comissão Venda CA-042', value: 85000, type: 'INCOME', category: 'Comissões', status: 'PAID', costCenter: 'Vendas', hasVoucher: true, reconciled: true },
  { id: '3', date: '11/10/2023', desc: 'Recebimento Aluguel AP-001', value: 4500, type: 'INCOME', category: 'Aluguéis', status: 'PAID', costCenter: 'Locação', hasVoucher: true, reconciled: false },
  { id: '4', date: '10/10/2023', desc: 'Conta de Energia (Sede)', value: 1240.50, type: 'EXPENSE', category: 'Custos Fixos', status: 'PENDING', costCenter: 'Administrativo', hasVoucher: false, reconciled: false },
  { id: '5', date: '09/10/2023', desc: 'IPTU Unidade Comercial LJ-09', value: 850, type: 'EXPENSE', category: 'Impostos', status: 'OVERDUE', costCenter: 'Administrativo', hasVoucher: true, reconciled: false },
];

const Financial: React.FC = () => {
  const [view, setView] = useState<'flow' | 'payable' | 'receivable' | 'fiscal'>('flow');

  const handleExportDIMOB = () => {
    alert("Gerando arquivo de exportação DIMOB (Ano-Base 2023). O arquivo seguirá o layout oficial da Receita Federal (PPR/RFB).");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro & Contabilidade</h1>
          <p className="text-slate-500">Gestão profissional de ativos, passivos e obrigações fiscais.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
            {['flow', 'payable', 'receivable', 'fiscal'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v as any)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${view === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {v === 'flow' ? 'Fluxo' : v === 'payable' ? 'A Pagar' : v === 'receivable' ? 'A Receber' : 'Fiscal'}
              </button>
            ))}
          </div>
          <button 
            onClick={handlePrint}
            className="p-2 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            title="Imprimir Relatório"
          >
            <Printer size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      {view === 'fiscal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ShieldCheck size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-900">Obrigações Acessórias - DIMOB</h3>
                <p className="text-xs text-slate-500">Declaração de Informações sobre Atividades Imobiliárias.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700 mb-1">Ano Calendário: 2023</p>
                <p className="text-xs text-slate-500">Status: Consolidando dados de locação e venda.</p>
              </div>
              <button 
                onClick={handleExportDIMOB}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all no-print"
              >
                <Download size={18} /> Gerar Arquivo DIMOB (.txt)
              </button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FileCheck size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-900">Documentação Contábil</h3>
                <p className="text-xs text-slate-500">Conciliação de comprovantes fiscais.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl text-center">
                <p className="text-2xl font-black text-emerald-600">92%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lançamentos c/ Anexo</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl text-center">
                <p className="text-2xl font-black text-indigo-600">85%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conciliado Bancário</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Receitas Brutas</h3>
              <p className="text-2xl font-black text-slate-900 mt-1">R$ 254.900,00</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><TrendingDown size={24} /></div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">-3%</span>
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Despesas / Repasses</h3>
              <p className="text-2xl font-black text-slate-900 mt-1">R$ 112.450,00</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><ArrowLeftRight size={24} /></div>
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lucro Líquido (Oper.)</h3>
              <p className="text-2xl font-black text-indigo-600 mt-1">R$ 142.450,00</p>
            </div>
            <div className="bg-indigo-900 p-6 rounded-2xl shadow-xl border border-indigo-800 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-xl"><Banknote size={24} /></div>
              </div>
              <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Disponível em Caixa</h3>
              <p className="text-2xl font-black mt-1">R$ 842.100,00</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-indigo-600"/>
                Livro Caixa & Conciliação
              </h3>
              <div className="flex gap-2 no-print">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <Archive size={14} /> Fechamento Período
                </button>
                <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-50">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lançamento / Doc.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Categoria / C.C.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Valor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Conciliação</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right no-print">Comprovante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{t.desc}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{t.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{t.category}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{t.costCenter}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {t.type === 'INCOME' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                          t.reconciled ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {t.reconciled ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                          {t.reconciled ? 'Conciliado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right no-print">
                        <button 
                          className={`p-2 rounded-lg transition-colors ${t.hasVoucher ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 hover:text-slate-500'}`}
                          title={t.hasVoucher ? "Ver Comprovante" : "Anexar Comprovante"}
                        >
                          <Paperclip size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Financial;
