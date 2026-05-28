import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import SobreView from './components/SobreView';
import ProdutosView from './components/ProdutosView';
import VagasView from './components/VagasView';
import ContatoView from './components/ContatoView';
import LoginView from './components/LoginView';
import AdminPanel from './components/AdminPanel';
import { SiteSettings } from './types';

export default function App() {
  const [currentView, setCurrentView] = React.useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(null);
  const [siteSettings, setSiteSettings] = React.useState<Record<string, string>>({});
  const [activeProductTab, setActiveProductTab] = React.useState<'avicultura' | 'citricultura' | 'cafeicultura' | 'agropecuaria'>('avicultura');
  const [showSplash, setShowSplash] = React.useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = React.useState<boolean>(false);

  // Verify persistent admin session of Shigueno local storage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('shigueno_user');
    const savedToken = localStorage.getItem('shigueno_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    fetchSettings();

    // Trigger splash fade out and final removal
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.config || {});
      }
    } catch (e) {
      console.error('Falha ao carregar configurações da página do SQLite:', e);
    }
  };

  const handleLoginSuccess = (userData: any, token: string) => {
    localStorage.setItem('shigueno_user', JSON.stringify(userData));
    localStorage.setItem('shigueno_token', token);
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('admin'); // Automatically redirect to admin dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('shigueno_user');
    localStorage.removeItem('shigueno_token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleNavigation = (viewKey: string, tab?: any) => {
    if (viewKey === 'produtos' && tab) {
      setActiveProductTab(tab);
    }
    setCurrentView(viewKey);
    // Smooth scroll to top of view on tab switch
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-sans selection:bg-emerald-200">
      
      {/* Spectacular Splash Entry Loader */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/15 to-amber-50/10 transition-all duration-500 ease-in-out ${
            isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Ambient gold/emerald background rings */}
            <div className="absolute w-52 h-52 border border-dashed border-emerald-800/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-60 h-60 border border-amber-500/10 rounded-full animate-pulse-glow"></div>
            
            {/* Visual Emblem Representation of Shigueno (Scaled Up) */}
            <div className="relative w-28 h-28 bg-emerald-800 rounded-b-3xl rounded-t-xl border-4 border-emerald-600 flex flex-col items-center justify-center shadow-xl overflow-hidden animate-bounce-soft">
              {/* Oranges & Eggs pure CSS simulation */}
              <div className="flex space-x-1.5 justify-center mt-3 scale-110">
                <span className="w-8 h-8 rounded-full bg-amber-500 block relative shadow">
                  <span className="absolute -top-1 right-2 w-3 h-2 bg-green-600 rounded-full rotate-45"></span>
                </span>
                <span className="w-8 h-8 rounded-full bg-amber-500 block relative shadow">
                  <span className="absolute -top-1 right-2 w-3 h-2 bg-green-600 rounded-full rotate-45"></span>
                </span>
              </div>
              {/* White Eggs */}
              <div className="flex space-x-1 justify-center -mt-2.5 z-10 scale-110">
                <span className="w-4.5 h-6.5 bg-white rounded-full block shadow-xs border border-gray-100"></span>
                <span className="w-4.5 h-6.5 bg-white rounded-full block shadow-xs border border-gray-100"></span>
                <span className="w-4.5 h-6.5 bg-white rounded-full block shadow-xs border border-gray-100"></span>
              </div>
              <span className="text-[10px] font-mono font-black tracking-widest text-[#f5f5f5] mt-2 uppercase">1932</span>
            </div>

            {/* Typography pair */}
            <div className="text-center mt-8 space-y-1">
              <span className="text-3xl font-sans font-black tracking-widest text-emerald-950 uppercase block leading-none">
                Shigueno
              </span>
              <span className="text-xs font-mono text-emerald-600 tracking-widest font-bold block uppercase mt-1">
                Qualidade de Vida
              </span>
            </div>

            {/* Glowing dynamic infinite action loading bar */}
            <div className="w-36 h-1.5 bg-slate-200/60 rounded-full mt-8 overflow-hidden relative border border-slate-100/50">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-800 to-amber-500 rounded-full animate-infinite-loading w-16"></div>
            </div>

            {/* Little sub-text badge */}
            <p className="text-[10.5px] font-mono text-slate-400 font-bold tracking-wide mt-2.5 animate-pulse">
              Conectando com o Campo...
            </p>
          </div>
        </div>
      )}

      {/* Central Header Navigation - Hidden in Admin Panel layout */}
      {currentView !== 'admin' && (
        <Header 
          currentView={currentView} 
          onNavigate={handleNavigation} 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView onNavigate={handleNavigation} siteSettings={siteSettings} />
        )}
        {currentView === 'sobre' && (
          <SobreView siteSettings={siteSettings} />
        )}
        {currentView === 'produtos' && (
          <ProdutosView activeTab={activeProductTab} onTabChange={setActiveProductTab} siteSettings={siteSettings} />
        )}
        {currentView === 'vagas' && (
          <VagasView onNavigate={handleNavigation} />
        )}
        {currentView === 'contato' && (
          <ContatoView siteSettings={siteSettings} />
        )}
        {currentView === 'login' && (
          <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigation} />
        )}
        {currentView === 'admin' && (
          isLoggedIn ? (
            <AdminPanel onLogout={handleLogout} onNavigate={handleNavigation} onSettingsUpdate={fetchSettings} />
          ) : (
            <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigation} />
          )
        )}
      </main>

      {/* Central Footer copyright and coordinates */}
      {currentView !== 'admin' && (
        <Footer onNavigate={handleNavigation} siteSettings={siteSettings} />
      )}
    </div>
  );
}
