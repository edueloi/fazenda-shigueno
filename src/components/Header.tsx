import React from 'react';
import { Menu, X, User, Heart, Leaf, Home, Info, Briefcase, Mail, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ currentView, onNavigate, isLoggedIn, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { key: 'home', label: 'Início', icon: Home, desc: 'Página inicial e pilares' },
    { key: 'sobre', label: 'Sobre Nós', icon: Info, desc: 'História, legado e pioneirismo' },
    { key: 'produtos', label: 'Nossa Produção', icon: Leaf, desc: 'Avicultura, Citros, Café e Nelore' },
    { key: 'vagas', label: 'Trabalhe Conosco', icon: Briefcase, desc: 'Candidate-se e faça história' },
    { key: 'contato', label: 'Contatos', icon: Mail, desc: 'Canais de atendimento, SAC' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Custom Styled Shigueno Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
            id="shigueno-logo-button"
          >
            {/* Visual Emblem Representation of Shigueno */}
            <div className="relative w-12 h-12 bg-emerald-800 rounded-b-2xl rounded-t-lg border-2 border-emerald-600 flex flex-col items-center justify-center shadow-md overflow-hidden group-hover:scale-105 transition-transform">
              {/* Oranges & Eggs pure CSS simulation */}
              <div className="flex space-x-0.5 justify-center mt-1">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 block relative">
                  <span className="absolute -top-0.5 right-1 w-1.5 h-1 bg-green-600 rounded-full rotate-45"></span>
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 block relative">
                  <span className="absolute -top-0.5 right-1 w-1.5 h-1 bg-green-600 rounded-full rotate-45"></span>
                </span>
              </div>
              {/* White Eggs */}
              <div className="flex space-x-0.5 justify-center -mt-1 z-10">
                <span className="w-2 h-3 bg-white rounded-full block shadow-xs border border-gray-150"></span>
                <span className="w-2 h-3 bg-white rounded-full block shadow-xs border border-gray-150"></span>
                <span className="w-2 h-3 bg-white rounded-full block shadow-xs border border-gray-150"></span>
              </div>
              <span className="text-[7px] font-mono font-bold tracking-widest text-[#f5f5f5] mt-1 uppercase">1932</span>
            </div>

            <div>
              <span className="text-xl font-sans font-extrabold tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors uppercase block leading-none">
                Shigueno
              </span>
              <span className="text-[10px] font-mono text-emerald-600 tracking-wider font-semibold block mt-0.5">
                Qualidade de Vida
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => {
                  onNavigate(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.key
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                {item.key === 'produtos' && <Leaf className="inline w-3.5 h-3.5 mr-1 text-emerald-600 align-text-bottom" />}
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Portal Action */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  id="header-admin-panel"
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Painel Gestor
                </button>
                <button
                  id="header-logout"
                  onClick={onLogout}
                  className="px-3 py-2 text-slate-500 hover:text-red-650 text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                id="header-login"
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-2 bg-emerald-750 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm hover:bg-emerald-850 hover:shadow transition-all"
              >
                <User className="w-4 h-4" />
                <span>Portal do Gestor</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center space-x-2">
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-md hover:bg-emerald-100 transition-colors"
              >
                Painel
              </button>
            )}
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-500 hover:text-emerald-800 focus:outline-none p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Beautiful Slide-Over Drawer Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop blur effect */}
          <div 
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar Area */}
          <div className="relative w-full max-w-[290px] bg-white h-screen flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header portion */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-850 text-white font-black flex items-center justify-center text-xs shadow-xs">S</span>
                <span className="font-extrabold text-[#064e3b] text-base font-sans tracking-tight">SHIGUENO</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                title="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation options list */}
            <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-2 font-mono">Navegação Principal</p>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.key;
                return (
                  <button
                    key={item.key}
                    id={`nav-mobile-${item.key}`}
                    onClick={() => {
                      onNavigate(item.key);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-xs font-semibold translate-x-1' 
                        : 'text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mr-3 ${isActive ? 'bg-emerald-700 text-white' : 'bg-slate-150/60 text-emerald-850'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold leading-none">{item.label}</p>
                      <p className={`text-[10px] mt-1 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-70 cursor-pointer ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Bottom Section with User portal context */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-1 py-1 flex items-center space-x-2.5 mb-2">
                    <div className="w-7 h-7 rounded-sm bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      AD
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Autenticado como</p>
                      <p className="text-xs font-extrabold text-slate-800 leading-none">Gestor Shigueno</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Acessar Painel do Gestor</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 border border-slate-250 text-slate-650 hover:bg-red-50 hover:text-red-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Sessão</span>
                  </button>
                </div>
              ) : (
                <button
                  id="mobile-login"
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white py-3 px-4 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Portal do Gestor</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
