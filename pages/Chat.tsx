
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  Circle,
  User,
  X,
  ChevronLeft
} from 'lucide-react';

const CONTACTS = [
  { id: '1', name: 'Marina Santos', lastMsg: 'Gostaria de agendar uma visita no AP-001', time: '14:25', online: true, unread: 2 },
  { id: '2', name: 'Ricardo Almeida', lastMsg: 'O repasse já caiu na minha conta?', time: '12:10', online: false, unread: 0 },
  { id: '3', name: 'André Luiz (Corretor)', lastMsg: 'Fechei a proposta do lote CM-12', time: 'Ontem', online: true, unread: 0 },
  { id: '4', name: 'João Ferreira', lastMsg: 'Pode me enviar o contrato?', time: 'Ontem', online: false, unread: 0 },
];

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(CONTACTS[0]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Olá! Eu vi o anúncio do Apartamento Moema no portal. Ele ainda está disponível para visitas amanhã à tarde?", sender: 'client', time: '14:20' },
    { id: 2, text: "Olá Marina! Sim, está disponível. Temos um horário livre às 15:30. Pode ser?", sender: 'admin', time: '14:22' },
    { id: 3, text: "Gostaria de agendar uma visita no AP-001", sender: 'client', time: '14:25' }
  ]);

  const handleSelectContact = (contact: typeof CONTACTS[0]) => {
    setSelectedChat(contact);
    setShowChatOnMobile(true);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessageText('');

    // Simulação de resposta automática após 1s
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: "Ok, entendi! Vou verificar essa informação para você agora mesmo.",
        sender: 'client',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, response]);
    }, 1500);
  };

  const handleMediaAction = (type: string) => {
    const actions: any = {
      phone: `Iniciando chamada de voz com ${selectedChat.name}...`,
      video: `Iniciando videochamada com ${selectedChat.name}...`,
      attach: "Selecione o arquivo para anexar à conversa",
      more: "Opções de contato: Silenciar, Bloquear, Limpar Chat."
    };
    alert(actions[type]);
  };

  return (
    <div className="h-[calc(100vh-100px)] lg:h-[calc(100vh-140px)] flex bg-white rounded-none lg:rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      
      {/* Sidebar List - Hidden on mobile when chat is active */}
      <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-slate-100 flex-col bg-slate-50/20`}>
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Comunicação</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar contatos..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {CONTACTS.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-indigo-50/50 transition-all border-l-4 ${selectedChat?.id === contact.id ? 'bg-indigo-50 border-indigo-600' : 'border-transparent'}`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-sm ${selectedChat?.id === contact.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={`text-sm font-bold truncate ${selectedChat?.id === contact.id ? 'text-indigo-900' : 'text-slate-900'}`}>{contact.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 truncate font-medium">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-indigo-100">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window - Hidden on mobile when no chat is active */}
      <div className={`${showChatOnMobile ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-slate-50/50 relative w-full h-full`}>
        {selectedChat ? (
          <>
            <div className="px-4 lg:px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Back Button for Mobile */}
                <button 
                  onClick={() => setShowChatOnMobile(false)}
                  className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 md:hidden transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 truncate max-w-[120px] lg:max-w-none">{selectedChat.name}</h4>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.15em] flex items-center gap-1">
                    <Circle size={8} fill="currentColor" /> {selectedChat.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button onClick={() => handleMediaAction('phone')} className="p-2 lg:p-2.5 hover:bg-slate-50 rounded-xl hover:text-indigo-600 active:scale-90 transition-all" title="Chamada"><Phone size={18} /></button>
                <button onClick={() => handleMediaAction('video')} className="p-2 lg:p-2.5 hover:bg-slate-50 rounded-xl hover:text-indigo-600 active:scale-90 transition-all" title="Vídeo"><Video size={18} /></button>
                <button onClick={() => handleMediaAction('more')} className="p-2 lg:p-2.5 hover:bg-slate-50 rounded-xl hover:text-indigo-600 active:scale-90 transition-all" title="Mais"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center">
                <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">Atendimento Iniciado</span>
              </div>

              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex gap-3 lg:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-xl shrink-0 flex items-center justify-center text-[10px] lg:text-xs font-black shadow-sm ${msg.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-100'}`}>
                    {msg.sender === 'admin' ? 'AD' : selectedChat.name.charAt(0)}
                  </div>
                  <div className={`max-w-[85%] lg:max-w-[75%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : ''}`}>
                    <div className={`p-3 lg:p-4 rounded-2xl shadow-sm border ${
                      msg.sender === 'admin' 
                        ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                        : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed font-medium break-words">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2 px-1">
                       {msg.time} {msg.sender === 'admin' && '• Lido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 lg:p-4 bg-white border-t border-slate-100 flex items-center gap-2 lg:gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
              <button type="button" onClick={() => handleMediaAction('attach')} className="p-2 lg:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all" title="Anexar"><Paperclip size={20} /></button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Mensagem..."
                  className="w-full pl-4 pr-10 lg:pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors hidden sm:block">
                  <Smile size={20} />
                </button>
              </div>
              <button 
                type="submit"
                disabled={!messageText.trim()}
                className="p-3 lg:p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 group"
              >
                <Send size={18} className="lg:size-[20px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
            <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-200 mb-4">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Suas Mensagens</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mt-2">Selecione um contato na barra lateral para iniciar uma conversa agora mesmo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageSquare = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

export default Chat;
