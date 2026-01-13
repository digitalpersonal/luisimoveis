
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Menu,
  X,
  Car,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  FileSearch
} from 'lucide-react';

const PORTAL_PROPERTIES = [
  { id: '1', title: 'Casa de Alto Padrão - Vila Betel', loc: 'Vila Betel, Guaranésia', price: 'R$ 850.000', beds: 3, baths: 3, area: 250, img: 'https://picsum.photos/seed/lux1/800/600', tag: 'Venda' },
  { id: '2', title: 'Apartamento Central Próximo à Praça', loc: 'Centro, Guaranésia', price: 'R$ 1.800/mês', beds: 2, baths: 1, area: 85, img: 'https://picsum.photos/seed/lux2/800/600', tag: 'Aluguel' },
  { id: '3', title: 'Loteamento Residencial Novo', loc: 'Jardim Primavera, Guaranésia', price: 'R$ 120.000', beds: 0, baths: 0, area: 300, img: 'https://picsum.photos/seed/lux3/800/600', tag: 'Venda' },
  { id: '4', title: 'Casa com Área Gourmet Completa', loc: 'Vila Rica, Guaranésia', price: 'R$ 2.500/mês', beds: 3, baths: 2, area: 180, img: 'https://picsum.photos/seed/lux4/800/600', tag: 'Aluguel' },
];

const FAQ_ITEMS = [
  {
    category: "Locação Facilitada",
    questions: [
      { q: "Quais documentos preciso para alugar um imóvel?", a: "Para pessoa física, solicitamos RG, CPF, Comprovante de Residência e de Renda (últimos 3 meses). Oferecemos diversas garantias como seguro fiança, título de capitalização ou fiador tradicional." },
      { q: "Quanto tempo demora a análise cadastral?", a: "Nossa análise é digital e rápida. Geralmente, em até 24 horas úteis você já tem o retorno sobre a aprovação da locação em Guaranésia." }
    ]
  },
  {
    category: "Compra & Financiamento",
    questions: [
      { q: "A imobiliária auxilia no processo de financiamento bancário?", a: "Sim! Cuidamos de toda a assessoria junto aos principais bancos (Caixa, BB, Itaú, etc.), desde a simulação até a assinatura da escritura." },
      { q: "Posso usar meu FGTS na compra do imóvel?", a: "Sim, para imóveis residenciais urbanos e se você atender aos requisitos do programa, o FGTS pode ser usado tanto para a entrada quanto para amortizar o saldo devedor." }
    ]
  },
  {
    category: "Vistorias & Entrega",
    questions: [
      { q: "Como funciona a vistoria de entrega?", a: "Realizamos uma vistoria fotográfica e descritiva minuciosa antes de você entrar e ao sair do imóvel, garantindo total transparência e segurança jurídica para ambas as partes." }
    ]
  }
];

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const [dealType, setDealType] = useState<'SALE' | 'RENT'>('SALE');
  const [propertyType, setPropertyType] = useState('RESIDENTIAL');
  const [bedrooms, setBedrooms] = useState('any');
  const [parking, setParking] = useState('any');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null);

  const toggleFaq = (index: string) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Header Responsivo */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 bg-indigo-600 rounded-xl text-white">
            <Home size={20} />
          </div>
          <span className="text-lg md:text-xl font-black text-white tracking-tighter">Luís <span className="text-indigo-400">Imóveis</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           {['Comprar', 'Alugar', 'Lançamentos', 'FAQ', 'Sobre'].map(item => (
             <a key={item} href={item === 'FAQ' ? '#faq' : '#'} className="text-sm font-black text-white uppercase tracking-widest hover:text-indigo-400 transition-colors">{item}</a>
           ))}
           <button 
             onClick={() => navigate('/')}
             className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
           >
             Acesso Restrito
           </button>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white bg-white/10 rounded-lg backdrop-blur-sm"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col p-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black text-white tracking-tighter">Luís <span className="text-indigo-400">Imóveis</span></span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X size={32}/></button>
          </div>
          <div className="flex flex-col gap-6">
            {['Comprar', 'Alugar', 'Lançamentos', 'FAQ', 'Sobre'].map(item => (
               <a key={item} href={item === 'FAQ' ? '#faq' : '#'} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-white uppercase tracking-widest border-b border-white/10 pb-4">{item}</a>
            ))}
            <button 
              onClick={() => navigate('/')}
              className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest"
            >
              Acesso Restrito
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center text-white overflow-hidden py-16 px-4">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Real Estate" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-105"
        />
        <div className="relative z-10 w-full max-w-6xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-7xl font-black mb-4 leading-tight md:leading-[0.9] tracking-tighter">
            O lar perfeito em <span className="text-indigo-400 block md:inline">Guaranésia</span>
          </h1>
          <p className="text-base md:text-xl mb-8 md:mb-12 text-slate-200 font-medium max-w-2xl mx-auto opacity-80 px-4">
            A maior curadoria de imóveis exclusivos em Guaranésia e região sul de Minas Gerais.
          </p>
          
          {/* Search Card */}
          <div className="bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-2xl max-w-6xl mx-auto text-left w-full">
            <div className="flex gap-2 md:gap-4 mb-6">
              <button 
                onClick={() => setDealType('SALE')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${dealType === 'SALE' ? 'bg-white text-slate-900 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Comprar
              </button>
              <button 
                onClick={() => setDealType('RENT')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${dealType === 'RENT' ? 'bg-white text-slate-900 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Alugar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-2">Onde?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="Bairro (Centro, Vila Betel...)" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:bg-white/20 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-2">Tipo</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-sm appearance-none outline-none focus:bg-white/20 transition-all cursor-pointer"
                  >
                    <option value="RESIDENTIAL" className="text-slate-900">Residencial</option>
                    <option value="COMMERCIAL" className="text-slate-900">Comercial</option>
                    <option value="LAND" className="text-slate-900">Lote</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-2">Quartos</label>
                <div className="relative">
                  <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <select 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-sm appearance-none outline-none focus:bg-white/20 transition-all cursor-pointer"
                  >
                    <option value="any" className="text-slate-900">Qualquer</option>
                    <option value="1" className="text-slate-900">1+ Quartos</option>
                    <option value="2" className="text-slate-900">2+ Quartos</option>
                    <option value="3" className="text-slate-900">3+ Quartos</option>
                    <option value="4" className="text-slate-900">4+ Quartos</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-2">Vagas</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <select 
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-sm appearance-none outline-none focus:bg-white/20 transition-all cursor-pointer"
                  >
                    <option value="any" className="text-slate-900">Qualquer</option>
                    <option value="1" className="text-slate-900">1+ Vagas</option>
                    <option value="2" className="text-slate-900">2+ Vagas</option>
                    <option value="3" className="text-slate-900">3+ Vagas</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <button className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 active:scale-95">
                  <Search size={18} />
                  Buscar
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 opacity-60">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest"><CheckCircle2 size={14} className="text-indigo-400" /> Vistorias Oficiais</div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest"><Sparkles size={14} className="text-indigo-400" /> Avaliação via IA</div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest"><BadgeCheck size={14} className="text-indigo-400" /> Guaranésia - MG</div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-4">Destaques da Região</h2>
            <p className="text-slate-500 font-medium">Imóveis selecionados em Guaranésia com as melhores condições de financiamento e locação facilitada.</p>
          </div>
          <button 
            className="group flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] md:text-xs hover:text-indigo-700 transition-colors"
          >
            Ver catálogo completo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {PORTAL_PROPERTIES.map((prop) => (
            <div key={prop.id} className="group cursor-pointer">
              <div className="relative h-64 md:h-[22rem] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                <img src={prop.img} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-xl">
                  {prop.tag}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 md:p-8">
                   <button className="w-full py-3 md:py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] md:text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
                     Ver Detalhes
                   </button>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">{prop.title}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin size={12} className="text-indigo-500" />
                {prop.loc}
              </div>
              <div className="flex items-center gap-6 md:gap-8 text-slate-600 text-xs font-black mb-6 bg-slate-50 p-4 rounded-2xl shadow-inner border border-slate-100">
                <span className="flex items-center gap-2.5"><Bed size={22} className="text-indigo-500" /> {prop.beds}</span>
                <span className="flex items-center gap-2.5"><Bath size={22} className="text-indigo-500" /> {prop.baths}</span>
                <span className="flex items-center gap-2.5"><Maximize size={22} className="text-indigo-500" /> {prop.area}m²</span>
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{prop.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-32 px-4 md:px-6 bg-slate-50 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
              <HelpCircle size={14} /> Dúvidas Comuns
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">Perguntas Frequentes</h2>
            <p className="text-slate-500 font-medium">Tudo o que você precisa saber para alugar ou comprar com segurança em Guaranésia.</p>
          </div>

          <div className="space-y-12">
            {FAQ_ITEMS.map((category, catIndex) => (
              <div key={catIndex} className="space-y-4">
                <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <FileSearch size={16} /> {category.category}
                </h3>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const id = `faq-${catIndex}-${faqIndex}`;
                    const isOpen = openFaqIndex === id;
                    return (
                      <div key={faqIndex} className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-indigo-200 shadow-xl shadow-indigo-900/5' : 'border-slate-100 shadow-sm hover:border-indigo-100'}`}>
                        <button 
                          onClick={() => toggleFaq(id)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                        >
                          <span className="text-sm md:text-base font-black text-slate-800 tracking-tight">{faq.q}</span>
                          <div className={`shrink-0 p-1.5 rounded-lg bg-slate-50 text-slate-400 transition-all ${isOpen ? 'rotate-180 bg-indigo-600 text-white' : ''}`}>
                            <ChevronDown size={18} />
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-6 pb-6 text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-indigo-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <MessageCircle size={160} />
            </div>
            <div className="relative z-10 text-center md:text-left">
              <h4 className="text-xl md:text-2xl font-black mb-2 tracking-tight">Ainda tem alguma dúvida?</h4>
              <p className="text-indigo-100 text-sm font-medium opacity-90">Nossa equipe de especialistas está pronta para te atender.</p>
            </div>
            <button className="relative z-10 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2">
              Falar com Especialista <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Local Info Section */}
      <section className="bg-white py-16 md:py-32 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Excelência Imobiliária em Guaranésia</h2>
            <div className="space-y-6">
              {[
                { t: 'Atendimento Humanizado', d: 'Entendemos a realidade da nossa cidade e as necessidades de quem vive aqui.' },
                { t: 'Conhecimento Local', d: 'Especialistas nos bairros de Guaranésia, garantindo a melhor avaliação para seu imóvel.' },
                { t: 'Transparência Total', d: 'Processos claros e suporte jurídico em todas as etapas da negociação.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">{i+1}</div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{item.t}</h4>
                    <p className="text-slate-500 font-medium text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square bg-indigo-600 rounded-[3rem] rotate-3 overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover -rotate-3 scale-110" alt="Consultoria" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
               <p className="text-3xl font-black text-indigo-600">+100</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contratos Ativos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 md:pt-32 pb-8 md:pb-16 px-4 md:px-6 border-t border-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6 md:mb-8">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Home size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Luís <span className="text-indigo-600">Imóveis</span></h3>
              </div>
              <p className="text-slate-500 max-w-sm mb-8 md:mb-10 font-medium leading-relaxed">Referência em inteligência imobiliária e gestão de ativos em Guaranésia e toda a região sul mineira.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Facebook size={20} /></a>
              </div>
            </div>
            <div>
              <h5 className="font-black text-slate-900 mb-6 md:mb-8 uppercase tracking-[0.2em] text-xs">Atendimento</h5>
              <ul className="space-y-4 text-slate-500 text-sm font-bold">
                <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-600" /> (35) 99999-0000</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-indigo-600" /> contato@luisimoveis.com.br</li>
                <li className="flex items-center gap-3"><MapPin size={18} className="text-indigo-600" /> Centro, Guaranésia - MG</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-900 mb-6 md:mb-8 uppercase tracking-[0.2em] text-xs">Acesso</h5>
              <button 
                onClick={() => navigate('/')}
                className="text-indigo-600 font-black uppercase text-xs tracking-widest hover:underline"
              >
                Portal Administrativo
              </button>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center md:text-left">
            <p>© 2024 Luís Imóveis Guaranésia. Soluções Imobiliárias.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portal;
