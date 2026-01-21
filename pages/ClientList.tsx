
import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MoreHorizontal, FileText, BadgeCheck, Trash, Edit, X, Share2, MessageSquare, Printer } from 'lucide-react';

const MOCK_CLIENTS = [
  { id: '1', name: 'Ricardo Almeida', doc: '123.456.789-00', type: 'Proprietário', status: 'Ativo', email: 'ricardo@email.com', phone: '(35) 98877-6655' },
  { id: '2', name: 'Marina Santos', doc: '987.654.321-11', type: 'Locatário', status: 'Inadimplente', email: 'marina@email.com', phone: '(35) 91122-3344' },
  { id: '3', name: 'Tech Solutions LTDA', doc: '12.345.678/0001-90', type: 'Proprietário', status: 'Ativo', email: 'contato@techsol.com', phone: '(35) 3344-5566' },
  { id: '4', name: 'Carlos Ferreira', doc: '444.555.666-77', type: 'Comprador', status: 'Novo', email: 'carlos.f@email.com', phone: '(35) 99988-7766' },
];

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleAction = (type: string, client: any) => {
    if (type === 'send_access') {
      const baseUrl = window.location.origin + window.location.pathname;
      const portalUrl = `${baseUrl}#/client-portal`;
      const message = encodeURIComponent(
        `Olá ${client.name}, tudo bem? 🏠\n\nAqui é da Luís Imóveis. Estamos disponibilizando seu acesso exclusivo ao nosso *Portal do Cliente*!\n\nAtravés dele você pode:\n✅ Baixar boletos e ver recibos\n✅ Consultar seus contratos\n✅ Solicitar reparos e manutenções\n\nClique no link para acessar: ${portalUrl}\n\nQualquer dúvida, estamos à disposição!`
      );
      const phoneClean = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phoneClean}?text=${message}`, '_blank');
      return;
    }

    const actions: any = {
      edit: `Editando cadastro de: ${client.name}`,
      delete: `Deseja excluir o cliente ${client.name}?`,
      view: `Visualizando dossiê de: ${client.name}`,
      whatsapp: `Iniciando conversa com ${client.name}...`
    };

    if (type === 'delete') {
      if(confirm(actions[type])) alert('Cliente removido da base.');
    } else if (type === 'whatsapp') {
      const phoneClean = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phoneClean}`, '_blank');
    } else {
      alert(actions[type]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Clientes</h1>
          <p className="text-slate-500 font-medium">Administre proprietários, inquilinos e prospectos de forma centralizada.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 shadow-sm uppercase tracking-widest text-xs"
          >
            <Printer size={20} /> Listagem Completa
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
          >
            <UserPlus size={20} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30 no-print">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, documento ou e-mail..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="hidden md:block px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:border-indigo-300 outline-none cursor-pointer">
            <option>Todos os tipos</option>
            <option>Proprietário</option>
            <option>Locatário</option>
            <option>Fiador</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identificação</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Perfil</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contatos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner uppercase">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{client.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.doc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Mail size={14} className="text-slate-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-black">
                        <MessageSquare size={14} />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                      client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      client.status === 'Novo' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right no-print">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAction('send_access', client)} 
                        className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl active:scale-90 transition-all shadow-sm flex items-center gap-2"
                        title="Enviar Acesso ao Portal"
                      >
                        <Share2 size={18} />
                      </button>
                      <button onClick={() => handleAction('view', client)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl active:scale-90 transition-all" title="Ver Dossiê">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => handleAction('edit', client)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl active:scale-90 transition-all" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleAction('delete', client)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl active:scale-90 transition-all" title="Excluir">
                        <Trash size={18} />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300 no-print">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-2xl tracking-tight">Novo Cadastro</h3>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Gestão de CRM Luís Imóveis</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 active:scale-95 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: Maria José Silva" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento (CPF/CNPJ)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Cliente</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                    <option>Proprietário</option>
                    <option>Locatário</option>
                    <option>Fiador</option>
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Celular (WhatsApp)</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="(35) 90000-0000" />
                </div>
              </div>
              <button 
                onClick={() => { alert('Cadastro realizado com sucesso!'); setShowModal(false); }}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
