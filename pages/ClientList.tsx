
import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MoreHorizontal, FileText, BadgeCheck, Trash, Edit, X } from 'lucide-react';

const MOCK_CLIENTS = [
  { id: '1', name: 'Ricardo Almeida', doc: '123.456.789-00', type: 'Proprietário', status: 'Ativo', email: 'ricardo@email.com', phone: '(11) 98877-6655' },
  { id: '2', name: 'Marina Santos', doc: '987.654.321-11', type: 'Locatário', status: 'Inadimplente', email: 'marina@email.com', phone: '(11) 91122-3344' },
  { id: '3', name: 'Tech Solutions LTDA', doc: '12.345.678/0001-90', type: 'Proprietário', status: 'Ativo', email: 'contato@techsol.com', phone: '(11) 3344-5566' },
  { id: '4', name: 'Carlos Ferreira', doc: '444.555.666-77', type: 'Comprador', status: 'Novo', email: 'carlos.f@email.com', phone: '(11) 99988-7766' },
];

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleAction = (type: string, name: string) => {
    const actions: any = {
      edit: `Editando cadastro de: ${name}`,
      delete: `Deseja excluir o cliente ${name}?`,
      view: `Visualizando dossiê de: ${name}`,
      whatsapp: `Iniciando conversa com ${name}...`
    };
    if (type === 'delete') {
      if(confirm(actions[type])) alert('Cliente removido da base.');
    } else {
      alert(actions[type]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500">Administre proprietários, inquilinos e prospectos de forma centralizada.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, documento ou e-mail..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="hidden md:block px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-300 outline-none cursor-pointer">
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identificação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contatos</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{client.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.doc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        {client.email}
                      </div>
                      <button 
                        onClick={() => handleAction('whatsapp', client.name)}
                        className="flex items-center gap-2 text-xs text-emerald-600 font-bold hover:underline"
                      >
                        <Phone size={12} />
                        {client.phone}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                      client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      client.status === 'Novo' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleAction('view', client.name)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg active:scale-90 transition-all" title="Ver Dossiê">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => handleAction('edit', client.name)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg active:scale-90 transition-all" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleAction('delete', client.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg active:scale-90 transition-all" title="Excluir">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-black text-xl">Novo Cadastro</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 active:scale-95 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Maria José Silva" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento (CPF/CNPJ)</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Cliente</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Proprietário</option>
                    <option>Locatário</option>
                    <option>Fiador</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => { alert('Cadastro realizado com sucesso!'); setShowModal(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
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
