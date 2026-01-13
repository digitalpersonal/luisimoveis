
import React, { useState } from 'react';
import { MoreHorizontal, Plus, Search, Calendar, User, Phone, MapPin, X, MessageSquare, Mail } from 'lucide-react';

const STAGES = [
  { id: 'new', label: 'Novo Lead', color: 'bg-blue-600' },
  { id: 'contact', label: 'Contato Feito', color: 'bg-indigo-600' },
  { id: 'visit', label: 'Visita Agendada', color: 'bg-amber-600' },
  { id: 'proposal', label: 'Proposta', color: 'bg-emerald-600' },
];

const MOCK_LEADS = [
  { id: '1', name: 'Ana Paula Moraes', property: 'Apartamento Moema', stage: 'new', value: 'R$ 1.2M', origin: 'Portal ZAP', time: 'Há 2h' },
  { id: '2', name: 'Bruno Silveira', property: 'Casa Alphaville', stage: 'contact', value: 'R$ 3.5M', origin: 'Instagram', time: 'Há 5h' },
  { id: '3', name: 'Carla Dias', property: 'Studio Itaim', stage: 'visit', value: 'R$ 4.2k/mês', origin: 'WhatsApp', time: 'Amanhã, 14h' },
  { id: '4', name: 'David Jones', property: 'Lote CM-12', stage: 'proposal', value: 'R$ 850k', origin: 'Indicação', time: 'Hoje' },
];

const Leads: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAction = (type: string, name: string) => {
    const messages: any = {
      call: `Ligando para ${name}...`,
      whatsapp: `Iniciando chat com ${name}...`,
      calendar: `Abrindo agenda para visita com ${name}`,
      details: `Visualizando histórico completo do lead: ${name}`
    };
    alert(messages[type]);
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Funil de Leads (CRM)</h1>
          <p className="text-slate-500">Gerencie a prospecção e o fechamento de novos negócios.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
          >
            <Plus size={18} /> Novo Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-x-auto pb-4 scrollbar-hide">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex flex-col min-w-[300px] h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color} animate-pulse`}></div>
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">{stage.label}</h3>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {MOCK_LEADS.filter(l => l.stage === stage.id).length}
                </span>
              </div>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400 active:scale-90 transition-all">
                <MoreHorizontal size={16}/>
              </button>
            </div>

            <div className="space-y-4 flex-1 bg-slate-100/40 p-3 rounded-2xl border-2 border-dashed border-slate-200/60 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
              {MOCK_LEADS.filter(l => l.stage === stage.id).map(lead => (
                <div key={lead.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider border border-indigo-100">{lead.origin}</span>
                    <button onClick={() => handleAction('details', lead.name)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
                      <MoreHorizontal size={14}/>
                    </button>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-5">
                    <MapPin size={12} className="text-indigo-500"/> {lead.property}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleAction('call', lead.name)} className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg active:scale-90 transition-all" title="Ligar">
                        <Phone size={14} />
                      </button>
                      <button onClick={() => handleAction('whatsapp', lead.name)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg active:scale-90 transition-all" title="WhatsApp">
                        <MessageSquare size={14} />
                      </button>
                      <button onClick={() => handleAction('calendar', lead.name)} className="p-2 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg active:scale-90 transition-all" title="Agendar Visita">
                        <Calendar size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-black text-slate-900 tracking-tighter">{lead.value}</span>
                  </div>
                  <div className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                    <User size={10}/> Corretor: André Luiz
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowModal(true)}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:border-indigo-300 hover:bg-white hover:text-indigo-600 transition-all active:scale-[0.98]"
              >
                + Novo Lead Coluna
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-xl">Novo Lead CRM</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 active:scale-95 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Cliente</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nome Completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Celular / WhatsApp</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origem</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Portal Imobiliário</option>
                    <option>WhatsApp</option>
                    <option>Instagram / Ads</option>
                    <option>Site Próprio</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imóvel de Interesse</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: AP-001 ou 'Apartamento Moema'" />
              </div>
              <button 
                onClick={() => { alert('Lead registrado no funil!'); setShowModal(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Criar Card no CRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
