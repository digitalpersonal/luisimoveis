
import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Search, 
  Upload, 
  MoreVertical, 
  FileText, 
  Image as ImageIcon,
  Download,
  Trash,
  ChevronRight
} from 'lucide-react';

const FOLDERS = [
  { id: '1', name: 'Contratos de Locação', count: 48, size: '124 MB' },
  { id: '2', name: 'Documentos de Clientes', count: 156, size: '450 MB' },
  { id: '3', name: 'Fotos de Imóveis', count: 1240, size: '2.1 GB' },
  { id: '4', name: 'Jurídico e RH', count: 12, size: '15 MB' },
];

const RECENT_FILES = [
  { id: 'f1', name: 'contrato_marina_santos.pdf', type: 'PDF', size: '2.4 MB', date: 'Hoje, 14:20' },
  { id: 'f2', name: 'fachada_residencial_parque.jpg', type: 'IMAGE', size: '4.1 MB', date: 'Ontem, 16:45' },
  { id: 'f3', name: 'documentacao_terreno_lote3.zip', type: 'ARCHIVE', size: '12 MB', date: '10/10/2023' },
];

const DocumentCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Documentos</h1>
          <p className="text-slate-500">Organização e armazenamento seguro de arquivos.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          <Upload size={20} />
          Upload de Arquivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FOLDERS.map(folder => (
          <div key={folder.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Folder size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={18} />
              </button>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{folder.name}</h4>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{folder.count} arquivos</span>
              <span>{folder.size}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-bold text-slate-800">Arquivos Recentes</h3>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Pesquisar em todos os documentos..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {RECENT_FILES.map(file => (
            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  file.type === 'PDF' ? 'bg-rose-50 text-rose-600' : 
                  file.type === 'IMAGE' ? 'bg-blue-50 text-blue-600' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  {file.type === 'PDF' ? <FileText size={20} /> : <ImageIcon size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{file.date} • {file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button title="Baixar" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                  <Download size={18} />
                </button>
                <button title="Excluir" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full p-4 text-center text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
          Ver todos os arquivos
        </button>
      </div>
    </div>
  );
};

export default DocumentCenter;
