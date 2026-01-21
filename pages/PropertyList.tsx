
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  MoreVertical, 
  Edit, 
  Trash, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  DollarSign,
  CheckCircle2,
  Car,
  Sofa,
  UtensilsCrossed,
  Square,
  FileText,
  Loader2,
  Image as ImageIcon,
  Star,
  Layers,
  Info,
  Tv,
  Waves,
  Pocket,
  ArrowUpCircle,
  ShieldCheck,
  TreePine,
  Box,
  PlusCircle,
  Tag,
  Coins,
  Sparkles,
  Wand2,
  MessageSquareText,
  Printer
} from 'lucide-react';
import { PropertyStatus, PropertyType, DealType } from '../types';
import { generatePropertyDescription } from '../services/geminiService';

const ITEMS_PER_PAGE = 8;
const MAX_PHOTOS = 12;

const INTERIOR_IMAGES = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512918766674-ed62b90eaa9c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&w=800&q=80',
];

const GENERATE_MOCK_PROPERTIES = () => {
  const baseProperties = [
    { code: 'AP', title: 'Apartamento Luxo Vila Nova', address: 'Av. Brasil, 1200 - Jardins', price: 1250000, rent: 4500, type: PropertyType.RESIDENTIAL, dealType: DealType.BOTH, beds: 3, suites: 1, baths: 2, parking: 2, area: 120 },
    { code: 'CA', title: 'Casa de Condomínio Moderna', address: 'Rua das Flores, 45 - Alphaville', price: 3450000, type: PropertyType.RESIDENTIAL, dealType: DealType.SALE, beds: 4, suites: 2, baths: 5, parking: 4, area: 380 },
    { code: 'CM', title: 'Laje Corporativa Faria Lima', address: 'Av. Faria Lima, 3500 - Itaim Bibi', rent: 28000, type: PropertyType.COMMERCIAL, dealType: DealType.RENT, beds: 0, suites: 0, baths: 4, parking: 10, area: 450 }
  ];

  const statuses = [PropertyStatus.AVAILABLE, PropertyStatus.RENTED, PropertyStatus.SOLD, PropertyStatus.RESERVED];
  
  return Array.from({ length: 32 }).map((_, i) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  
  // Form State
  const [selectedDealType, setSelectedDealType] = useState<DealType>(DealType.SALE);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>(PropertyType.RESIDENTIAL);
  const [publicDescription, setPublicDescription] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Form Inputs
  const titleRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);
  const bedsRef = useRef<HTMLInputElement>(null);
  const suitesRef = useRef<HTMLInputElement>(null);
  const bathsRef = useRef<HTMLInputElement>(null);
  const parkingRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const highlightsRef = useRef<HTMLInputElement>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || prop.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [properties, searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const handleAction = (type: string, property: any) => {
    if (type === 'delete') {
      if (confirm(`Excluir o imóvel ${property.code}?`)) {
        setProperties(prev => prev.filter(p => p.id !== property.id));
      }
    } else if (type === 'edit') {
      setEditingProperty(property);
      setSelectedDealType(property.dealType);
      setSelectedPropertyType(property.type);
      setShowModal(true);
    }
  };

  // Preencher campos ao editar
  useEffect(() => {
    if (editingProperty && showModal) {
      setTimeout(() => {
        if (titleRef.current) titleRef.current.value = editingProperty.title;
        if (codeRef.current) codeRef.current.value = editingProperty.code;
        if (neighborhoodRef.current) neighborhoodRef.current.value = editingProperty.address;
        if (bedsRef.current) bedsRef.current.value = editingProperty.beds;
        if (suitesRef.current) suitesRef.current.value = editingProperty.suites || 0;
        if (bathsRef.current) bathsRef.current.value = editingProperty.baths;
        if (parkingRef.current) parkingRef.current.value = editingProperty.parking;
        if (areaRef.current) areaRef.current.value = editingProperty.area;
      }, 50);
    }
  }, [editingProperty, showModal]);

  const handleAiGeneration = async () => {
    setIsGeneratingAi(true);
    const data = {
      type: selectedPropertyType,
      dealType: selectedDealType,
      bedrooms: bedsRef.current?.value || '0',
      suites: suitesRef.current?.value || '0',
      bathrooms: bathsRef.current?.value || '0',
      parkingSpots: parkingRef.current?.value || '0',
      areaTotal: areaRef.current?.value || '0',
      address: { neighborhood: neighborhoodRef.current?.value || '' },
      description: highlightsRef.current?.value || ''
    };
    const desc = await generatePropertyDescription(data);
    setPublicDescription(desc);
    setIsGeneratingAi(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      setEditingProperty(null);
      alert('Imóvel salvo com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Carteira de Imóveis</h1>
          <p className="text-slate-500 font-medium">Gerencie o acervo da imobiliária.</p>
        </div>
        <div className="flex gap-2 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Printer size={20} /> Imprimir Catálogo
          </button>
          <button 
            onClick={() => { setEditingProperty(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} /> Novo Imóvel
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center no-print">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((prop) => (
          <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all flex flex-col">
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
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <p className="text-lg font-black text-indigo-600">R$ {(prop.price || prop.rent).toLocaleString()}</p>
                <button onClick={() => window.open('/#/portal', '_blank')} className="text-slate-400 hover:text-indigo-600 no-print"><ExternalLink size={18}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in no-print">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
               <h3 className="font-black text-2xl">{editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}</h3>
               <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input ref={titleRef} placeholder="Título" className="p-4 bg-slate-50 border rounded-xl font-bold" />
                <input ref={codeRef} placeholder="Código" className="p-4 bg-slate-50 border rounded-xl font-black" />
                <input ref={neighborhoodRef} placeholder="Endereço / Bairro" className="p-4 bg-slate-50 border rounded-xl md:col-span-2 font-medium" />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase mb-1">Dorms</label>
                  <input ref={bedsRef} type="number" className="p-3 border rounded-xl" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase mb-1">Suítes</label>
                  <input ref={suitesRef} type="number" className="p-3 border rounded-xl" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase mb-1">BHs</label>
                  <input ref={bathsRef} type="number" className="p-3 border rounded-xl" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase mb-1">Vagas</label>
                  <input ref={parkingRef} type="number" className="p-3 border rounded-xl" />
                </div>
              </div>

              <div className="pt-6 border-t flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-4 bg-slate-100 rounded-xl font-black uppercase text-xs">Cancelar</button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
