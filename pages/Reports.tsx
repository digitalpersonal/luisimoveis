
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { FileText, Download, TrendingUp, Filter, ShieldCheck, PieChart as PieIcon, BarChart3, Printer } from 'lucide-react';

const occupancyData = [
  { name: 'Alugados', value: 124 },
  { name: 'Disponíveis', value: 32 },
];
const COLORS = ['#4f46e5', '#e2e8f0'];

const performanceData = [
  { month: 'Jan', meta: 40, real: 38 },
  { month: 'Fev', meta: 40, real: 42 },
  { month: 'Mar', meta: 45, real: 40 },
  { month: 'Abr', meta: 45, real: 51 },
  { month: 'Mai', meta: 50, real: 48 },
];

const Reports: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios e BI</h1>
          <p className="text-slate-500">Insights gerenciais e conformidade contábil imobiliária.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            <Printer size={18} /> Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            <Download size={18} /> Exportar Completo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600"/> Desempenho de Vendas (Meta x Real)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="meta" name="Meta (Vendas)" stroke="#cbd5e1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="real" name="Realizado" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieIcon size={20} className="text-indigo-600"/> Taxa de Ocupação da Carteira
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-around h-72">
            <div className="w-full h-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <div className="text-sm">
                  <p className="text-slate-500 font-medium">Alugados</p>
                  <p className="text-lg font-black text-slate-900">124 imóveis (79%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="text-sm">
                  <p className="text-slate-500 font-medium">Disponíveis</p>
                  <p className="text-lg font-black text-slate-900">32 imóveis (21%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-600"/> 
            Central de Documentos Oficiais & Contábeis
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">Pronto para Auditoria</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'DRE - Demonst. de Resultado', desc: 'Análise de lucro/prejuízo real do período.', icon: <BarChart3 size={20}/> },
            { title: 'DIMOB Consolidada', desc: 'Arquivo pronto para importação no PGD DIMOB.', icon: <FileText size={20}/> },
            { title: 'Relatório de Inadimplência', desc: 'Histórico de atrasos por cliente e imóvel.', icon: <FileText size={20}/> },
            { title: 'Balancete Contábil', desc: 'Resumo de contas patrimoniais e de resultado.', icon: <BarChart3 size={20}/> },
            { title: 'Extrato de Repasses', desc: 'Todos os pagamentos feitos a proprietários.', icon: <Download size={20}/> },
            { title: 'Mapa de Comissões', desc: 'Controle de valores devidos a corretores.', icon: <Download size={20}/> }
          ].map((report, i) => (
            <div key={i} className="flex flex-col p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-slate-50 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white text-slate-400 rounded-xl group-hover:text-indigo-600 shadow-sm border border-slate-50 transition-colors">
                  {report.icon}
                </div>
                <div className="flex gap-2 no-print">
                   <Printer size={16} className="text-slate-300 group-hover:text-indigo-400" onClick={(e) => { e.stopPropagation(); window.print(); }} />
                   <Download size={16} className="text-slate-300 group-hover:text-indigo-400" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{report.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{report.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
