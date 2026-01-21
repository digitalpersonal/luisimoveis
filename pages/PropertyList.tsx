
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  ExternalLink,
  X,
  Printer
} from 'lucide-react';
import { PropertyStatus, PropertyType, DealType } from '../types';
import { generatePropertyDescription } from '../services/geminiService';

const ITEMS_PER_PAGE = 8;

const INTERIOR_IMAGES = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512918766674-ed62b90eaa9c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&w=800&q=80',
];

const GENERATE_MOCK_PROPERTIES = () => {
  const baseProperties = [
    { code: 'AP', title: 'Apartamento Centro Guaranésia', address: 'Rua Benjamin Constant, Centro', price: 350000, rent: 1200, type: PropertyType.RESIDENTIAL, dealType: DealType.BOTH, beds: 2, suites: 0, baths: 1, parking: 1, area: 75 },
    { code: 'CA', title: 'Casa Ampla Vila Betel', address: 'Rua Sete de Setembro, Vila Betel', price: 680000, type: PropertyType.RESIDENTIAL, dealType: DealType.SALE, beds: 3, suites: 1, baths: 2, parking: 2, area: 180 },
    { code: 'LT', title: 'Lote Jardim Primavera', address: 'Quadra B, Jardim Primavera', price: 110000, type: PropertyType.LAND, dealType: DealType.SALE, beds: 0, suites: 0, baths: 0, parking: 0, area: 300 }
  ];

  const statuses = [PropertyStatus.AVAILABLE, PropertyStatus.RENTED, PropertyStatus.SOLD, PropertyStatus.RESERVED];
  
  return Array.from({ length: 12 }).map((_, i) => {
    const base = baseProperties[i % baseProperties.length];
    return {
      ...base,
      id: (i + 1).toString(),
      code: `${base.code}-${(100 + i).toString()}`,
      title: `${base.title} #${i + 1}`,
      status: statuses[i % statuses.length],
      image: INTERIOR_IMAGES[i % INTERIOR_IMAGES.length]
    };
  });
};

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState(GENERATE_MOCK_PROPERTIES());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      return prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prop.address.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [properties, searchTerm]);

  const currentItems = filteredProperties;

  const handleAction = (type: string, property: any) => {
    if (type === 'delete') {
      if (confirm(`Excluir o imóvel ${property.code}?`)) {
        setProperties(prev => prev.filter(p => p.id !== property.id));
      }
    } else if (type === 'edit') {
      setEditingProperty(property);
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Imóveis em Guaranésia</h1>
          <p className="text-slate-500 font-medium">Gestão da carteira local da Luís Imóveis.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm">
            <Printer size={20} /> Imprimir Catálogo
          </button>
          <button onClick={() => { setEditingProperty(null); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl">
            <Plus size={20} /> Novo Imóvel
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 no-print">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por bairro ou código..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((prop) => (
          <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-4 right-4 flex flex-col gap-2 no-print">
                <button onClick={() => handleAction('edit', prop)} className="p-2 bg-white rounded-lg shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit size={16}/></button>
                <button onClick={() => handleAction('delete', prop)} className="p-2 bg-white rounded-lg shadow-lg hover:bg-rose-600 hover:text-white transition-all"><Trash size={16}/></button>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-black uppercase text-indigo-600">{prop.code}</span>
              <h3 className="font-black text-slate-900 truncate mb-1">{prop.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold mb-4">{prop.address}</p>
              <p className="text-lg font-black text-indigo-600">R$ {(prop.price || prop.rent).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">{editingProperty ? 'Editar' : 'Novo'} Imóvel</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <p className="text-slate-500 mb-6">Interface de edição completa disponível na versão desktop.</p>
            <button onClick={() => setShowModal(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
