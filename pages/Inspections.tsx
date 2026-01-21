
import React from 'react';
import { ClipboardCheck, Search, Plus, Camera, AlertCircle, CheckCircle2, MoreVertical, MapPin, Calendar } from 'lucide-react';

const MOCK_INSPECTIONS = [
  { id: '1', property: 'Apartamento Moema', type: 'ENTRADA', client: 'Marina Santos', date: '15/10/2023', status: 'DONE', photos: 24 },
  { id: '2', property: 'Studio Itaim', type: 'SAÍDA', client: 'Ricardo Almeida', date: '18/10/2023', status: 'PENDING', photos: 0 },
  { id: '3', property: 'Casa Alphaville', type: 'ENTRADA', client: 'Bruno Silveira', date: '12/10/2023', status: 'DISPUTED', photos: 45 },
];

const Inspections: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vistorias Técnicas</h1>
          <p className="text-slate-500">Documentação do estado de conservação para contratos de locação.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Nova Vistoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ClipboardCheck size={20}/></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aguardando Execução</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">08</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertCircle size={20}/></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Com Divergência</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">03</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={20}/></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Concluídas (Mês)</h3>
          </div>
          <p className="text-3xl font-black text-slate-900">42</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Filtrar vistorias..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_INSPECTIONS.map(insp => (
            <div key={insp.id} className="p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 transition-colors group">
              <div className={`p-4 rounded-2xl border ${insp.type === 'ENTRADA' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <p className="text-[10px] font-black uppercase text-center">{insp.type}</p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900">{insp.property}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    insp.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    insp.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {insp.status === 'DONE' ? 'Finalizada' : insp.status === 'PENDING' ? 'Pendente' : 'Divergência'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {insp.client}</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1"><Calendar size={12}/> {insp.date}</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1"><Camera size={12}/> {insp.photos} fotos</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Visualizar PDF</button>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inspections;
