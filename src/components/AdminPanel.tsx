import React from 'react';
import { 
  Users, Briefcase, TrendingUp, Phone, MapPin, Plus, Trash2, 
  Edit, CheckCircle2, ChevronRight, X, AlertCircle, RefreshCw, BarChart2,
  FileText, Calendar, Filter, Download, Menu, Home, LogOut,
  Truck, Navigation, Compass, Map, Activity, Play, CheckCircle, Clock, Settings
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Vacancy, Candidate, Supplier, DashboardStats } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  onNavigate: (viewKey: string) => void;
  onSettingsUpdate?: () => void;
}

const COLORS = ['#047857', '#fbbf24', '#065f46', '#f59e0b', '#1e3a8a', '#dc2626'];

const PRESET_COORDS: Record<string, { lat: number; lng: number }> = {
  'Tatuí (Granja)': { lat: -23.3556, lng: -47.8556 },
  'Tatuí (Sede)': { lat: -23.3556, lng: -47.8556 },
  'Tatuí (Fazenda Nova Aliança)': { lat: -23.3556, lng: -47.8556 },
  'Santo Antônio do Leverger (MT)': { lat: -15.8656, lng: -56.0781 },
  'Santo Antônio do Leverger': { lat: -15.8656, lng: -56.0781 },
  'Sorocaba (Distribuição)': { lat: -23.5015, lng: -47.4522 },
  'São Paulo (Mercado Municipal)': { lat: -23.5489, lng: -46.6388 },
  'Mogi das Cruzes (Avicultura)': { lat: -23.5222, lng: -46.1889 },
  'Buri - SP (Citros)': { lat: -23.7975, lng: -48.5133 },
  'Itaí - SP (Café)': { lat: -23.4167, lng: -49.0167 }
};

export default function AdminPanel({ onLogout, onNavigate, onSettingsUpdate }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'reports' | 'suppliers' | 'vacancies' | 'candidates' | 'tracking' | 'settings'>('reports');
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Authenticated fetch helper to pass security middleware
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('shigueno_token') || '';
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': token
      }
    });
  };
  
  // Real database states
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  
  const [loading, setLoading] = React.useState(true);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  // Real-time tracking fleet states
  const [routes, setRoutes] = React.useState<any[]>([]);
  const [selectedRouteId, setSelectedRouteId] = React.useState<number | null>(null);
  const [simulationActive, setSimulationActive] = React.useState<boolean>(true);
  
  // Create Route Form Overlay
  const [routeFormOpen, setRouteFormOpen] = React.useState(false);
  const [driverName, setDriverName] = React.useState('');
  const [vehiclePlate, setVehiclePlate] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState('Caminhão Baú (Ovos)');
  const [startLocation, setStartLocation] = React.useState('Tatuí (Granja)');
  const [destination, setDestination] = React.useState('Sorocaba (Distribuição)');
  const [cargoDesc, setCargoDesc] = React.useState('');
  const [customEventText, setCustomEventText] = React.useState('');

  // Modal / Form triggers for CRUD
  const [supplierFormOpen, setSupplierFormOpen] = React.useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState<number | null>(null);
  const [supName, setSupName] = React.useState('');
  const [supCity, setSupCity] = React.useState('');
  const [supPhone, setSupPhone] = React.useState('');
  const [supCattleCount, setSupCattleCount] = React.useState(0);
  const [supCattleBreed, setSupCattleBreed] = React.useState('Nelore');
  const [supStatus, setSupStatus] = React.useState('Ativo');
  const [supLastDelivery, setSupLastDelivery] = React.useState('');

  const [vacancyFormOpen, setVacancyFormOpen] = React.useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = React.useState<number | null>(null);
  const [vacTitle, setVacTitle] = React.useState('');
  const [vacDept, setVacDept] = React.useState('');
  const [vacDesc, setVacDesc] = React.useState('');
  const [vacLoc, setVacLoc] = React.useState('Tatuí - SP');
  const [vacReq, setVacReq] = React.useState('');
  const [vacStatus, setVacStatus] = React.useState('Ativa');

  // Candidate detail viewer
  const [viewingCandidate, setViewingCandidate] = React.useState<Candidate | null>(null);

  // Filters
  const [cityFilter, setCityFilter] = React.useState('Todos');
  const [candidateStatusFilter, setCandidateStatusFilter] = React.useState('Todos');

  // Editable settings fields state
  const [siteMotto, setSiteMotto] = React.useState('');
  const [siteAboutIntro, setSiteAboutIntro] = React.useState('');
  const [siteAboutFull, setSiteAboutFull] = React.useState('');
  const [siteAboutDiversification, setSiteAboutDiversification] = React.useState('');
  const [siteContactEmail, setSiteContactEmail] = React.useState('');
  const [siteContactPhone, setSiteContactPhone] = React.useState('');
  const [siteProdAvicultura, setSiteProdAvicultura] = React.useState('');
  const [siteProdCitricultura, setSiteProdCitricultura] = React.useState('');
  const [siteProdCafeicultura, setSiteProdCafeicultura] = React.useState('');
  const [siteProdNelore, setSiteProdNelore] = React.useState('');
  const [activeEditTab, setActiveEditTab] = React.useState<'home' | 'sobre' | 'produtos' | 'contato'>('home');

  React.useEffect(() => {
    fetchInitialData();
  }, [activeSubTab]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setErrorNotice(null);
      
      // Fetch Dashboard stats
      const reportsRes = await fetch('/api/dashboard/reports');
      const reportsData = await reportsRes.json();
      if (reportsData.success) {
        setStats(reportsData.stats);
      }

      // Fetch Supplier list
      const suppliersRes = await fetch('/api/suppliers');
      const suppliersData = await suppliersRes.json();
      if (suppliersData.success) {
        setSuppliers(suppliersData.suppliers || []);
      }

      // Fetch Vacancies list
      const vacanciesRes = await fetch('/api/vacancies');
      const vacanciesData = await vacanciesRes.json();
      if (vacanciesData.success) {
        setVacancies(vacanciesData.vacancies || []);
      }

      // Fetch Candidates list
      const candidatesRes = await fetch('/api/candidates');
      const candidatesData = await candidatesRes.json();
      if (candidatesData.success) {
        setCandidates(candidatesData.candidates || []);
      }

      // Fetch Tracking routes list
      const routesRes = await fetch('/api/routes');
      const routesData = await routesRes.json();
      if (routesData.success) {
        const loadedRoutes = routesData.routes || [];
        setRoutes(loadedRoutes);
        
        // Autoselect first active route if nothing is selected yet
        if (loadedRoutes.length > 0) {
          const activeOnes = loadedRoutes.filter((r: any) => r.status === 'Ativa');
          if (activeOnes.length > 0) {
            setSelectedRouteId(prev => prev !== null ? prev : activeOnes[0].id);
          } else {
            setSelectedRouteId(prev => prev !== null ? prev : loadedRoutes[0].id);
          }
        }
      }

      // Fetch current site settings
      const settingsRes = await fetch('/api/site-settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.config) {
        setSiteMotto(settingsData.config.company_motto || '');
        setSiteAboutIntro(settingsData.config.about_text_intro || '');
        setSiteAboutFull(settingsData.config.about_text_full || '');
        setSiteAboutDiversification(settingsData.config.about_diversification || '');
        setSiteContactEmail(settingsData.config.contact_email || '');
        setSiteContactPhone(settingsData.config.contact_phone || '');
        setSiteProdAvicultura(settingsData.config.prod_avicultura_desc || '');
        setSiteProdCitricultura(settingsData.config.prod_citricultura_desc || '');
        setSiteProdCafeicultura(settingsData.config.prod_cafeicultura_desc || '');
        setSiteProdNelore(settingsData.config.prod_nelore_desc || '');
      }

    } catch (e) {
      console.error(e);
      setErrorNotice('Falha de sincronização de rede com o servidor SQLite de Tatuí.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // --- CRUD SITE SETTINGS COMPONENT ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorNotice(null);
      const res = await authFetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_motto: siteMotto,
          about_text_intro: siteAboutIntro,
          about_text_full: siteAboutFull,
          about_diversification: siteAboutDiversification,
          contact_email: siteContactEmail,
          contact_phone: siteContactPhone,
          prod_avicultura_desc: siteProdAvicultura,
          prod_citricultura_desc: siteProdCitricultura,
          prod_cafeicultura_desc: siteProdCafeicultura,
          prod_nelore_desc: siteProdNelore
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Configurações e dados do site gravados no SQLite com sucesso!');
        if (typeof onSettingsUpdate === 'function') {
          onSettingsUpdate();
        }
      } else {
        setErrorNotice(data.error || 'Erro ao gravar configurações.');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Erro de rede ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD GADO FORNECEDOR (MT) ---
  const saveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supCity || !supPhone || !supLastDelivery) {
      alert('Favor preencher todos os campos do fornecedor.');
      return;
    }

    const payload = {
      name: supName,
      city: supCity,
      phone: supPhone,
      cattle_count: Number(supCattleCount) || 0,
      cattle_breed: supCattleBreed,
      status: supStatus,
      last_delivery: supLastDelivery
    };

    try {
      let res;
      if (selectedSupplierId) {
        res = await authFetch(`/api/suppliers/${selectedSupplierId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccess(selectedSupplierId ? 'Fornecedor atualizado com sucesso.' : 'Novo fornecedor cadastrado com sucesso no SQLite.');
        setSupplierFormOpen(false);
        resetSupplierForm();
        fetchInitialData();
      } else {
        alert('Erro ao salvar fornecedor: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar fornecedor.');
    }
  };

  const deleteSupplier = async (id: number) => {
    if (!confirm('Deseja realmente remover este fornecedor gaúcho/mato-grossense da base de dados?')) return;
    try {
      const res = await authFetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess('Fornecedor removido com sucesso.');
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditSupplier = (sup: Supplier) => {
    setSelectedSupplierId(sup.id);
    setSupName(sup.name);
    setSupCity(sup.city);
    setSupPhone(sup.phone);
    setSupCattleCount(sup.cattle_count);
    setSupCattleBreed(sup.cattle_breed);
    setSupStatus(sup.status);
    setSupLastDelivery(sup.last_delivery);
    setSupplierFormOpen(true);
  };

  const resetSupplierForm = () => {
    setSelectedSupplierId(null);
    setSupName('');
    setSupCity('');
    setSupPhone('');
    setSupCattleCount(0);
    setSupCattleBreed('Nelore');
    setSupStatus('Ativo');
    setSupLastDelivery('');
  };

  // --- CRUD VAGAS ---
  const saveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacTitle || !vacDept || !vacDesc || !vacReq) {
      alert('Preencha os campos essenciais da vaga corporativa.');
      return;
    }

    const payload = {
      title: vacTitle,
      department: vacDept,
      description: vacDesc,
      location: vacLoc,
      requirements: vacReq,
      status: vacStatus
    };

    try {
      let res;
      if (selectedVacancyId) {
        res = await authFetch(`/api/vacancies/${selectedVacancyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/vacancies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccess(selectedVacancyId ? 'Vaga corrigida e atualizada.' : 'Nova vaga publicada no portal do Trabalhe Conosco.');
        setVacancyFormOpen(false);
        resetVacancyForm();
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVacancy = async (id: number) => {
    if (!confirm('Deseja realmente remover esta vaga do sistema? Candidaturas vinculadas terão esta vaga desvinculada.')) return;
    try {
      const res = await authFetch(`/api/vacancies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess('Vaga excluída com êxito.');
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditVacancy = (vac: Vacancy) => {
    setSelectedVacancyId(vac.id);
    setVacTitle(vac.title);
    setVacDept(vac.department);
    setVacDesc(vac.description);
    setVacLoc(vac.location);
    setVacReq(vac.requirements);
    setVacStatus(vac.status);
    setVacancyFormOpen(true);
  };

  const resetVacancyForm = () => {
    setSelectedVacancyId(null);
    setVacTitle('');
    setVacDept('');
    setVacDesc('');
    setVacLoc('Tatuí - SP');
    setVacReq('');
    setVacStatus('Ativa');
  };

  // --- RECRUTAMENTO GERENCIAR CURRÍCULOS ---
  const updateCandidateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await authFetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(`Ficha atualizada para status: ${newStatus}`);
        if (viewingCandidate && viewingCandidate.id === id) {
          setViewingCandidate({ ...viewingCandidate, status: newStatus });
        }
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCandidate = async (id: number) => {
    if (!confirm('Deseja purgar este currículo da lixeira interna? Esta operação é irreversível.')) return;
    try {
      const res = await authFetch(`/api/candidates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess('Currículo expurgado do banco.');
        setViewingCandidate(null);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- RASTREAMENTO CORRIDA SIMULATOR AND MUTATIONS ---
  
  const createRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !vehiclePlate || !cargoDesc) {
      alert('Por favor, preencha o Nome do Motorista, a Placa do Veículo e a Descrição da Carga.');
      return;
    }

    try {
      const startPreset = PRESET_COORDS[startLocation] || { lat: -23.3556, lng: -47.8556 };
      
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_name: driverName,
          vehicle_plate: vehiclePlate.toUpperCase(),
          vehicle_type: vehicleType,
          start_location: startLocation,
          destination: destination,
          current_lat: startPreset.lat,
          current_lng: startPreset.lng,
          cargo_description: cargoDesc
        })
      });

      const data = await res.json();
      if (data.success) {
        showSuccess('Rota e rastreamento GPS em tempo real iniciados com sucesso!');
        setRouteFormOpen(false);
        setDriverName('');
        setVehiclePlate('');
        setCargoDesc('');
        
        const freshRes = await fetch('/api/routes');
        const freshData = await freshRes.json();
        if (freshData.success) {
          const loaded = freshData.routes || [];
          setRoutes(loaded);
          setSelectedRouteId(data.id);
        }
      }
    } catch (e) {
      console.error(e);
      setErrorNotice('Falha de rede ao tentar iniciar a rota.');
    }
  };

  const deleteRoute = async (id: number) => {
    if (!confirm('Deseja purgar este registro de rota finalizada? O histórico será excluído.')) return;
    try {
      const res = await fetch(`/api/routes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess('Registro de rota expurgado do sistema.');
        if (selectedRouteId === id) setSelectedRouteId(null);
        const freshRes = await fetch('/api/routes');
        const freshData = await freshRes.json();
        if (freshData.success) {
          setRoutes(freshData.routes || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const manualEventReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteId || !customEventText.trim()) return;

    try {
      const currentRoute = routes.find(r => r.id === selectedRouteId);
      if (!currentRoute) return;

      const res = await fetch(`/api/routes/${selectedRouteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          last_event: customEventText,
          event_occurred: customEventText
        })
      });

      const data = await res.json();
      if (data.success) {
        showSuccess('Evento e posicionamento gravados no histórico!');
        setCustomEventText('');
        const freshRes = await fetch('/api/routes');
        const freshData = await freshRes.json();
        if (freshData.success) {
          setRoutes(freshData.routes || []);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerStepProgress = async (id: number, forcedProgressAdd?: number) => {
    try {
      const currentRoute = routes.find(r => r.id === id);
      if (!currentRoute || currentRoute.status !== 'Ativa') return;

      const prevProgress = currentRoute.progress || 0;
      const addVal = forcedProgressAdd !== undefined ? forcedProgressAdd : 5;
      const newProgress = Math.min(prevProgress + addVal, 100);

      const startPreset = PRESET_COORDS[currentRoute.start_location] || { lat: -23.3556, lng: -47.8556 };
      const endPreset = PRESET_COORDS[currentRoute.destination] || { lat: -23.7975, lng: -48.5133 };

      const latVal = startPreset.lat + (endPreset.lat - startPreset.lat) * (newProgress / 100);
      const lngVal = startPreset.lng + (endPreset.lng - startPreset.lng) * (newProgress / 100);

      const statusVal = newProgress >= 100 ? 'Concluída' : 'Ativa';
      const speedVal = statusVal === 'Concluída' ? 0 : (65 + Math.floor(Math.random() * 25));
      const fuelVal = Math.max(currentRoute.fuel_level - (forcedProgressAdd !== undefined ? 2 : 1), 5);

      let logMsg = currentRoute.last_event;
      if (newProgress === 100) {
        logMsg = 'Destino alcançado. Carga entregue com sucesso e comprovante assinado.';
      } else if (newProgress % 20 === 0) {
        logMsg = `Veículo cruzando rodovia a ${speedVal} km/h. Condição estável.`;
      }

      const res = await fetch(`/api/routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_lat: latVal,
          current_lng: lngVal,
          progress: newProgress,
          speed: speedVal,
          fuel_level: fuelVal,
          last_event: logMsg,
          status: statusVal,
          event_occurred: forcedProgressAdd !== undefined ? `Progresso alterado manualmente para ${newProgress}%` : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        const freshRes = await fetch('/api/routes');
        const freshData = await freshRes.json();
        if (freshData.success) {
          setRoutes(freshData.routes || []);
        }
      }
    } catch (e) {
      console.error('Falha de simulação GPS:', e);
    }
  };

  // Automated GPS Simulator Clock (Every 6 seconds)
  React.useEffect(() => {
    let intervalId: any = null;
    if (simulationActive && activeSubTab === 'tracking') {
      intervalId = setInterval(() => {
        const activeRoutes = routes.filter(r => r.status === 'Ativa');
        activeRoutes.forEach(route => {
          triggerStepProgress(route.id);
        });
      }, 6000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [simulationActive, routes, activeSubTab]);

  // Filter lists
  const filteredSuppliers = suppliers.filter(s => cityFilter === 'Todos' || s.city === cityFilter);
  const filteredCandidates = candidates.filter(c => candidateStatusFilter === 'Todos' || c.status === candidateStatusFilter);

  // Distinct cities in MT for dropdown filter
  const uniqueMTCities = Array.from(new Set(suppliers.map(s => s.city)));

  return (
    <div className="min-h-screen bg-slate-50/70 flex font-sans w-full" id="manager-panel-container">
      {/* MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* PORTAL SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1e13] text-emerald-100 flex flex-col h-screen border-r border-emerald-900 shadow-2xl transition-transform duration-300 ease-in-out
        md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* SIDEBAR HEADER / BRANDING */}
        <div className="p-6 border-b border-emerald-900/60 bg-[#06150c] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-emerald-950 font-black text-sm tracking-tight shadow-md select-none">
              S
            </span>
            <div>
              <h2 className="font-extrabold text-amber-500 text-xs uppercase tracking-widest leading-none">Grupo Shigueno</h2>
              <span className="text-[10px] text-emerald-300 font-bold uppercase font-mono mt-1 block">Painel do Gestor</span>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900 hover:text-white transition-colors"
            title="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED IN USER PROFILE */}
        <div className="p-4 mx-4 my-2.5 bg-emerald-900/20 rounded-2xl border border-emerald-800/40 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-850 border-2 border-emerald-700/60 flex items-center justify-center text-xs font-black text-amber-400">
            {(() => {
              const savedUser = localStorage.getItem('shigueno_user');
              const name = savedUser ? JSON.parse(savedUser).name : 'G';
              return name.charAt(0).toUpperCase();
            })()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-extrabold text-white truncate">
              {(() => {
                const savedUser = localStorage.getItem('shigueno_user');
                return savedUser ? JSON.parse(savedUser).name : 'Gestor Geral';
              })()}
            </p>
            <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-wide uppercase">
              {(() => {
                const savedUser = localStorage.getItem('shigueno_user');
                return savedUser ? JSON.parse(savedUser).role : 'Administrador';
              })()}
            </span>
          </div>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { key: 'reports', label: 'Relatórios Gerais', icon: BarChart2 },
            { key: 'suppliers', label: 'Compra de Gado (MT)', icon: TrendingUp },
            { key: 'tracking', label: 'Rastreamento & Frotas', icon: Truck },
            { key: 'vacancies', label: 'Cadastro de Vagas', icon: Briefcase },
            { key: 'candidates', label: 'Seleção & Currículos', icon: Users },
            { key: 'settings', label: 'Dados do Site', icon: Settings }
          ].map((item) => {
            const IconComponent = item.icon;
            const active = activeSubTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSubTab(item.key as any);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  active 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                    : 'text-emerald-250 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM NAV / ACTIONS */}
        <div className="p-4 border-t border-emerald-900/60 bg-[#06150c]/80 space-y-1.5">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/40 transition-colors text-[11px] font-bold cursor-pointer"
          >
            <Home className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Voltar ao Site</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-100 hover:bg-red-950/45 transition-colors text-[11px] font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* PORTAL MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* CUSTOM PORTAL TOPBAR */}
        <header className="bg-white border-b border-slate-150 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-650 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider font-mono">
                Conexão SQLite Ativa
              </span>
              <h1 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-none mt-0.5">
                {activeSubTab === 'reports' && 'Painel de Controle — Estatísticas'}
                {activeSubTab === 'suppliers' && 'Pecuária Mato Grosso — Fornecedores'}
                {activeSubTab === 'vacancies' && 'Gestão de Oportunidades Empregatícias'}
                {activeSubTab === 'candidates' && 'Recrutamento & Seleção de Talentos'}
                {activeSubTab === 'tracking' && 'Rastreamento de Transportes & Frotas'}
                {activeSubTab === 'settings' && 'Dados e Divulgação da Instituição'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchInitialData}
              title="Sincronizar base SQLite"
              className="p-2 px-3 rounded-xl transition-all hover:bg-slate-50 hover:text-emerald-800 text-slate-500 flex items-center space-x-1.5 border border-slate-150 shadow-2xs text-[11px] font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden xs:inline">Sincronizar</span>
            </button>
            
            <button
              onClick={() => onNavigate('home')}
              className="p-2 px-3 border border-slate-150 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold shadow-2xs hidden xs:inline-block cursor-pointer"
            >
              Ir ao Site
            </button>
          </div>
        </header>

        {/* CONTAINER WORKSPACE */}
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {successNotice && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-905 rounded-xl p-4 text-xs font-bold shadow-xs animate-slide-in flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}
          {errorNotice && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-bold leading-relaxed shadow-xs animate-pulse flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {loading ? (
            <div className="py-24 text-center text-slate-400 italic text-sm flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-emerald-700 animate-spin" />
              <span>Consultando banco de dados local SQLite de Tatuí...</span>
            </div>
          ) : (
            <div className="animate-fade-in font-sans">
            
            {/* SUBTAB 1: RELATÓRIOS EM TEMPO REAL */}
            {activeSubTab === 'reports' && stats && (
              <div className="space-y-8">
                
                {/* Micro KPIs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Cabanha Nelore (MT)</p>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalCattleHead} cabeças</h4>
                      <p className="text-[10px] text-slate-400 font-mono italic">Sob fornecedores logados</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Parceiros Registrados</p>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalSuppliers} pecuaristas</h4>
                      <p className="text-[10px] text-emerald-600 font-mono font-semibold">Cidades de Mato Grosso</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Recrutamento Vacâncias</p>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalVacancies} vagas</h4>
                      <p className="text-[10px] text-slate-400 font-mono italic">Disponíveis no site</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
                    <div className="p-3 bg-amber-105 text-amber-900 rounded-xl">
                      <FileText className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Inscrições Recebidas</p>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalCandidates} currículos</h4>
                      <p className="text-[10px] text-orange-650 font-semibold font-mono">Processados no painel</p>
                    </div>
                  </div>

                </div>

                {/* Real-time Production Charts block */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Production chart */}
                  <div className="bg-white border border-slate-150 p-6 rounded-3xl space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">Escoamento De Safra Consolidado (Tons / Milhares)</h3>
                        <p className="text-[10px] text-slate-500">Fluxos de colheita e postura monitorados em tempo real.</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono uppercase">Em tempo real</span>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.productionStats} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                          <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="ovos" name="Ovos Nova Aliança (caixas)" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="citros" name="Laranjas Tatuí/Buri (toneladas)" stroke="#047857" strokeWidth={3} />
                          <Line type="monotone" dataKey="cafe" name="Café Arábica Itaí (sacas)" stroke="#8b5a2b" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Cattle distribution Chart */}
                  <div className="bg-white border border-slate-150 p-6 rounded-3xl space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">Distribuição Regional Do Nelores (MT)</h3>
                        <p className="text-[10px] text-slate-500">Divisão do rebanho por microrregião de Santo Antônio do Leverger e adjacentes.</p>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded font-mono uppercase">Divisão Gado</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="h-60">
                        {stats.cityDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.cityDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="city"
                              >
                                {stats.cityDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: '11px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs italic text-slate-400">Nenhum gado cadastrado.</div>
                        )}
                      </div>

                      {/* Map Legends of MT cattle suppliers distribution */}
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-bold text-slate-950 uppercase tracking-wide">Foco por Município:</p>
                        {stats.cityDistribution.map((cityRow, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                              <span className="font-semibold text-slate-700">{cityRow.city}</span>
                            </div>
                            <span className="font-mono text-slate-500">
                              {cityRow.value} cab. ({cityRow.supplier_count} farm)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Applicants by Job vacancy distribution */}
                <div className="bg-white border border-slate-150 p-6 rounded-3xl space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm">Estatísticas De Recrutamento (Currículos por Cargo)</h3>
                    <p className="text-[10px] text-slate-500">Acompanhamento de volume de candidaturas em tempo real por anúncio publicado.</p>
                  </div>

                  <div className="h-64">
                    {stats.candidatesByVacancy.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.candidatesByVacancy} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                          <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                          <Tooltip contentStyle={{ fontSize: '11px' }} />
                          <Bar dataKey="value" name="Número de Fichas" fill="#047857" radius={[6, 6, 0, 0]}>
                            {stats.candidatesByVacancy.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#047857' : '#059669'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs italic text-slate-400">Nenhum currículo cadastrado na base ainda.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 2: GESTÃO FORNECEDORES GADO (MT) */}
            {activeSubTab === 'suppliers' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Fornecedores de Gado de Mato Grosso</h2>
                    <p className="text-xs text-slate-500">Banco de dados SQLite para gerenciar parcerias, cabeças de Nelore e entregas.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-emerald-850"
                      >
                        <option value="Todos">Filtrar Todas Cidades</option>
                        {uniqueMTCities.map((city, idx) => (
                          <option key={idx} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        resetSupplierForm();
                        setSupplierFormOpen(true);
                      }}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Fornecedor (MT)</span>
                    </button>
                  </div>
                </div>

                {/* SQLite Supplier CRUD Form Dialog */}
                {supplierFormOpen && (
                  <div className="bg-[#fafbfa] border border-emerald-300 rounded-3xl p-6 shadow-xs animate-slide-in">
                    <div className="flex justify-between items-center border-b border-emerald-150 pb-3 mb-4">
                      <h3 className="font-extrabold text-emerald-950 text-sm">
                        {selectedSupplierId ? '✏ Editar Fornecedor' : '➕ Cadastrar Fornecedor Nelore (MT)'}
                      </h3>
                      <button 
                        onClick={() => {
                          setSupplierFormOpen(false);
                          resetSupplierForm();
                        }}
                        className="text-xs text-slate-400 hover:text-slate-650 font-bold"
                      >
                        Cancelar [X]
                      </button>
                    </div>

                    <form onSubmit={saveSupplier} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Nome do Fornecedor / Fazenda *</label>
                        <input
                          type="text"
                          required
                          value={supName}
                          onChange={(e) => setSupName(e.target.value)}
                          placeholder="Ex: Fazenda Santa Maria"
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Cidade no Mato Grosso *</label>
                        <input
                          type="text"
                          required
                          value={supCity}
                          onChange={(e) => setSupCity(e.target.value)}
                          placeholder="Ex: Santo Antônio do Leverger"
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Telefone Contato *</label>
                        <input
                          type="text"
                          required
                          value={supPhone}
                          onChange={(e) => setSupPhone(e.target.value)}
                          placeholder="Ex: (65) 99885-4411"
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 font-mono">Contagem de Nelores (Cabeças)</label>
                        <input
                          type="number"
                          value={supCattleCount}
                          onChange={(e) => setSupCattleCount(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Raça Principal Bovino</label>
                        <select
                          value={supCattleBreed}
                          onChange={(e) => setSupCattleBreed(e.target.value)}
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-emerald-850"
                        >
                          <option value="Nelore">Nelore</option>
                          <option value="Nelore Puro">Nelore Puro (MBO)</option>
                          <option value="Angus">Angus</option>
                          <option value="Cruzamento Industrial">Cruzamento Industrial</option>
                          <option value="Nelore de Elite">Nelore de Elite</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Estatuto de Parceria</label>
                        <select
                          value={supStatus}
                          onChange={(e) => setSupStatus(e.target.value)}
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-emerald-850"
                        >
                          <option value="Ativo">Ativo (Regular)</option>
                          <option value="Em Negociação">Em Negociação</option>
                          <option value="Inativo">Inativo (Pausado)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Data Último Carregamento *</label>
                        <input
                          type="date"
                          required
                          value={supLastDelivery}
                          onChange={(e) => setSupLastDelivery(e.target.value)}
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-end justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSupplierFormOpen(false);
                            resetSupplierForm();
                          }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                        >
                          Salvar no SQLite
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Suppliers Data Table */}
                <div className="overflow-x-auto border border-slate-150 rounded-2xl bg-white shadow-xs">
                  <table className="min-w-full divide-y divide-slate-150 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase">
                      <tr>
                        <th className="px-6 py-4">Fornecedor / Fazenda</th>
                        <th className="px-6 py-4">Cidade (MT)</th>
                        <th className="px-6 py-4">Contato Telefônico</th>
                        <th className="px-6 py-4">Cabeças Gado</th>
                        <th className="px-6 py-4">Raça Principal</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Última Entrega</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-sans text-slate-700">
                      {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((sup) => (
                          <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{sup.name}</td>
                            <td className="px-6 py-4 text-xs font-semibold">{sup.city}</td>
                            <td className="px-6 py-4 text-xs font-mono">{sup.phone}</td>
                            <td className="px-6 py-4 font-bold text-amber-850 font-mono text-xs">{sup.cattle_count} cab.</td>
                            <td className="px-6 py-4 text-xs">{sup.cattle_breed}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                sup.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' :
                                sup.status === 'Em Negociação' ? 'bg-amber-100 text-amber-850' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {sup.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono">{sup.last_delivery}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center items-center space-x-2">
                                <button
                                  onClick={() => openEditSupplier(sup)}
                                  className="p-1 px-2 border border-slate-200 rounded text-slate-600 hover:text-emerald-800 hover:border-emerald-300 transition-colors text-xs font-bold"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => deleteSupplier(sup.id)}
                                  className="p-1 px-2 border border-slate-200 rounded text-red-650 hover:text-white hover:bg-red-650 transition-colors text-xs font-bold"
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-slate-400 text-xs italic">
                            Nenhum fornecedor localizado para "{cityFilter}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBTAB 3: CADASTRO DE VAGAS */}
            {activeSubTab === 'vacancies' && (
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-150 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Gerenciador de Vagas de Recrutamento</h2>
                    <p className="text-xs text-slate-500">Crie, altere e publique novas demandas do site unificado "Trabalhe Conosco".</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      resetVacancyForm();
                      setVacancyFormOpen(true);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Nova Vaga Rural</span>
                  </button>
                </div>

                {vacancyFormOpen && (
                  <div className="bg-[#fafbfa] border border-emerald-350 rounded-3xl p-6 shadow-xs animate-slide-in">
                    <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
                      <h3 className="font-extrabold text-emerald-950 text-sm">
                        {selectedVacancyId ? '✏ Editar Vaga Corporativa' : '➕ Publicar Vaga Agrícola / Pecuária'}
                      </h3>
                      <button 
                        onClick={() => {
                          setVacancyFormOpen(false);
                          resetVacancyForm();
                        }}
                        className="text-xs text-slate-400 hover:text-slate-650 font-bold"
                      >
                        Cancelar [X]
                      </button>
                    </div>

                    <form onSubmit={saveVacancy} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Título do Cargo *</label>
                          <input
                            type="text"
                            required
                            value={vacTitle}
                            onChange={(e) => setVacTitle(e.target.value)}
                            placeholder="Ex: Tratorista Agrícola especializado"
                            className="w-full bg-white border border-slate-250 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Setor / Departamento *</label>
                          <input
                            type="text"
                            required
                            value={vacDept}
                            onChange={(e) => setVacDept(e.target.value)}
                            placeholder="Ex: Citricultura, Avicultura"
                            className="w-full bg-white border border-slate-250 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Localização Fazenda *</label>
                          <input
                            type="text"
                            required
                            value={vacLoc}
                            onChange={(e) => setVacLoc(e.target.value)}
                            placeholder="Ex: Tatuí - SP"
                            className="w-full bg-white border border-slate-250 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-emerald-850"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Descrição das Atribuições *</label>
                        <textarea
                          rows={3}
                          required
                          value={vacDesc}
                          onChange={(e) => setVacDesc(e.target.value)}
                          placeholder="Responsabilidades do empregado diárias, cuidados rurais..."
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-emerald-850 font-sans leading-relaxed"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Requisitos Técnicos / Cursos *</label>
                        <textarea
                          rows={2}
                          required
                          value={vacReq}
                          onChange={(e) => setVacReq(e.target.value)}
                          placeholder="Ex: Disponibilidade para residir em Tatuí. Conhecimento de adubação."
                          className="w-full bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-emerald-850 font-sans leading-relaxed"
                        ></textarea>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Status Interno</label>
                          <select
                            value={vacStatus}
                            onChange={(e) => setVacStatus(e.target.value)}
                            className="bg-white border border-slate-250 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-emerald-850"
                          >
                            <option value="Ativa">Ativa (Visível para candidatos)</option>
                            <option value="Pausada">Pausada (Oculta no site)</option>
                          </select>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVacancyFormOpen(false);
                              resetVacancyForm();
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors"
                          >
                            Publicar Vaga
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vacancies.map((v) => (
                    <div key={v.id} className="bg-white border border-slate-150 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold bg-[#fafbfa] text-emerald-850 border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                            {v.department}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-950 mt-1 pl-1 border-l-2 border-amber-500">{v.title}</h3>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-750'
                        }`}>
                          {v.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pl-1">
                        <p>📍 <strong>Local:</strong> {v.location}</p>
                        <p className="line-clamp-2">📝 <strong>Atividades:</strong> {v.description}</p>
                        <p className="line-clamp-1 italic">⭐ <strong>Requisitos:</strong> {v.requirements}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-mono">ID SQLite: #0{v.id}</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => openEditVacancy(v)}
                            className="p-1 px-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded hover:border-emerald-300 hover:bg-emerald-50/20 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteVacancy(v.id)}
                            className="p-1 px-2.5 border border-slate-200 text-red-650 font-bold text-xs rounded hover:bg-red-650 hover:text-white transition-all"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SUBTAB 4: CADASTRO DE CURRÍCULOS */}
            {activeSubTab === 'candidates' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* List of candidates column */}
                <div className={`${viewingCandidate ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Banco de Currículos Submetidos</h2>
                      <p className="text-xs text-slate-500">Filas de candidaturas rurais unificadas recebidas no site.</p>
                    </div>

                    <div>
                      <select
                        value={candidateStatusFilter}
                        onChange={(e) => setCandidateStatusFilter(e.target.value)}
                        className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                      >
                        <option value="Todos">Status de Seleção</option>
                        <option value="Novo">Novo</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Recusado">Recusado</option>
                      </select>
                    </div>
                  </div>

                  {/* List items */}
                  <div className="space-y-3">
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          id={`candidate-row-${cand.id}`}
                          onClick={() => setViewingCandidate(cand)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            viewingCandidate?.id === cand.id
                              ? 'border-emerald-600 bg-emerald-50/20'
                              : 'border-slate-150 hover:border-emerald-300 bg-white hover:shadow-xs'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-extrabold text-slate-900 text-sm">{cand.name}</h4>
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                              cand.status === 'Novo' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                              cand.status === 'Em Análise' ? 'bg-amber-100 text-amber-850' :
                              cand.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {cand.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-medium">
                            Anunciado para: <strong className="text-slate-800 font-sans">{cand.vacancy_title || 'Candidatura Espontânea'}</strong>
                          </p>

                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>📅 Postagem: {cand.applied_at}</span>
                            <span className="text-emerald-800 font-bold flex items-center">
                              Ver Ficha Completa
                              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 bg-slate-50 text-center border rounded-xl text-xs italic text-slate-400">
                        Nenhum currículo encontrado sob as condições.
                      </div>
                    )}
                  </div>

                </div>

                {/* Candidate detailed view Column */}
                {viewingCandidate && (
                  <div className="lg:col-span-6 bg-[#fafbfa] border border-slate-150 rounded-3xl p-6 space-y-6 animate-slide-in relative">
                    <button
                      onClick={() => setViewingCandidate(null)}
                      className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-650"
                    >
                      Fechar [X]
                    </button>

                    <div className="space-y-1 border-b border-slate-150 pb-4">
                      <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">Análise de Recursos Humanos</span>
                      <h3 className="text-xl font-extrabold text-slate-950 font-sans tracking-tight">{viewingCandidate.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold font-mono">📅 Recebido via site em: {viewingCandidate.applied_at}</p>
                    </div>

                    {/* Applicant Contatcs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-2xl border border-slate-150">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Endereço de E-mail</p>
                        <a href={`mailto:${viewingCandidate.email}`} className="font-bold text-emerald-800 hover:underline break-words mt-0.5 block">
                          {viewingCandidate.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Celular WhatsApp</p>
                        <a href={`tel:${viewingCandidate.phone}`} className="font-bold text-slate-800 hover:underline mt-0.5 block font-mono">
                          {viewingCandidate.phone}
                        </a>
                      </div>
                      <div className="sm:col-span-2 border-t border-slate-100 pt-2 mt-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Vaga Almejada</p>
                        <p className="font-bold text-slate-900 mt-0.5">{viewingCandidate.vacancy_title || 'Envio Espontâneo / Banco reserva'}</p>
                      </div>
                    </div>

                    {/* Parsing text CV content */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-700 uppercase">Experiência Escrita / Currículo Copiado:</p>
                      <div className="bg-white border rounded-2xl p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 h-64 overflow-y-auto">
                        {viewingCandidate.cv_text}
                      </div>
                    </div>

                    {/* Change Recruitment Status */}
                    <div className="border-t border-slate-150 pt-4 space-y-3">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Atualizar Andamento De Seleção:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Novo', 'Em Análise', 'Aprovado', 'Recusado'].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateCandidateStatus(viewingCandidate.id, st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              viewingCandidate.status === st
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => deleteCandidate(viewingCandidate.id)}
                          className="flex items-center space-x-1 text-red-650 hover:text-red-750 font-bold text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remover do Banco</span>
                        </button>
                        
                        <p className="text-[9px] text-slate-400 font-mono italic">Identificador SQLite candidato: #{viewingCandidate.id}</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* SUBTAB 5: RASTREAMENTO & FROTAS */}
            {activeSubTab === 'tracking' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. SEÇÃO ESQUERDA: LISTA DE ROTAS E DISPARO DE VIAGEM */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Frota Logística</h2>
                        <p className="text-2xs text-slate-500 font-bold uppercase tracking-wider font-mono">Controle de Escoamento</p>
                      </div>
                      
                      <button
                        onClick={() => setRouteFormOpen(!routeFormOpen)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Despacho</span>
                      </button>
                    </div>

                    {/* FORM OVERLAY TO INICIATE ROUTE */}
                    {routeFormOpen && (
                      <form onSubmit={createRoute} className="bg-slate-50 border border-emerald-100 rounded-2xl p-4 mb-6 space-y-4 shadow-inner animate-fade-in text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100/60">
                          <span className="font-bold text-emerald-850 uppercase flex items-center space-x-1">
                            <Compass className="w-4 h-4 text-amber-500 animate-spin" />
                            <span>Iniciar Nova Rota</span>
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setRouteFormOpen(false)}
                            className="text-slate-400 hover:text-slate-600 font-bold"
                          >
                            [X] Cancelar
                          </button>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Nome do Motorista</label>
                          <input 
                            type="text" 
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            placeholder="Ex: Ricardo N. Santos"
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800 focus:outline-emerald-800"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Placa (Veículo)</label>
                            <input 
                              type="text" 
                              value={vehiclePlate}
                              onChange={(e) => setVehiclePlate(e.target.value)}
                              placeholder="Ex: SHI-2026"
                              className="w-full px-3 py-2 border rounded-xl text-xs bg-white uppercase text-slate-800 focus:outline-emerald-800"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Tipo de Veículo</label>
                            <select
                              value={vehicleType}
                              onChange={(e) => setVehicleType(e.target.value)}
                              className="w-full px-2 py-2 border rounded-xl text-xs bg-white text-slate-800 focus:outline-emerald-800"
                            >
                              <option value="Caminhão Baú (Ovos)">Caminhão Baú (Ovos)</option>
                              <option value="Semirreboque Gaiola (Gado)">Gaiola Nelore (Gado)</option>
                              <option value="Caminhão Graneleiro (Adubo)">Graneleiro (Adubo)</option>
                              <option value="Sider Lonado (Citros)">Lonado (Citros)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Partida / Origem</label>
                            <select
                              value={startLocation}
                              onChange={(e) => setStartLocation(e.target.value)}
                              className="w-full px-2 py-2 border rounded-xl text-xs bg-white text-slate-800 focus:outline-emerald-800"
                            >
                              {Object.keys(PRESET_COORDS).map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Destino Final</label>
                            <select
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                              className="w-full px-2 py-2 border rounded-xl text-xs bg-white text-slate-800 focus:outline-emerald-800"
                            >
                              {Object.keys(PRESET_COORDS).map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1 font-mono uppercase text-2xs">Carga & Manifesto de Transporte</label>
                          <input 
                            type="text" 
                            value={cargoDesc}
                            onChange={(e) => setCargoDesc(e.target.value)}
                            placeholder="Ex: 140 caixas de Ovos Tipo Extra / Esterco"
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800 focus:outline-emerald-800"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-emerald-855 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition-colors shadow-xs uppercase tracking-wider cursor-pointer"
                        >
                          🚚 Despachar & Iniciar Rota
                        </button>
                      </form>
                    )}

                    <div className="space-y-3.5">
                      {routes.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6">Nenhum registro de rastreador cadastrado.</p>
                      ) : (
                        routes.map((rt) => {
                          const isActive = rt.status === 'Ativa';
                          const isSelected = selectedRouteId === rt.id;
                          return (
                            <div
                              key={rt.id}
                              onClick={() => setSelectedRouteId(rt.id)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-emerald-50/40 border-emerald-600 shadow-sm' 
                                  : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                    isActive ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {rt.status === 'Ativa' ? '🔴 Em Rota' : '✅ Concluída'}
                                  </span>
                                  <h4 className="text-xs font-black text-slate-950 truncate mt-1">{rt.driver_name}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono">{rt.vehicle_type} • <strong className="text-slate-700">{rt.vehicle_plate}</strong></p>
                                </div>
                                
                                {rt.status !== 'Ativa' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteRoute(rt.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-red-650 transition-colors cursor-pointer"
                                    title="Remover histórico"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Progress miniature */}
                              <div className="mt-3.5 space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                  <span>Progresso:</span>
                                  <span className="font-bold text-slate-700">{rt.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-emerald-600' : 'bg-slate-500'}`}
                                    style={{ width: `${rt.progress}%` }}
                                  />
                                </div>
                              </div>

                              <div className="mt-3 text-[10px] border-t border-slate-100 pt-2 flex justify-between text-slate-450 font-bold">
                                <span>Origem: {rt.start_location}</span>
                                <span>➜ {rt.destination}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* CONTROLE SIMULADOR GERAL */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs text-xs space-y-3">
                    <h3 className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-emerald-700 animate-pulse" />
                      <span>Painel de Simulação de Trânsito</span>
                    </h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Quando ativado, o sistema simula o movimento dinâmico do caminhão na rodovia a cada 6 segundos, calculando combustível, velocidade e coordenadas do GPS automaticamente.
                    </p>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="font-bold text-slate-600 font-mono text-2xs uppercase">Relógio de Transmissão (6s)</span>
                      <button
                        onClick={() => setSimulationActive(!simulationActive)}
                        className={`px-3 py-1.5 rounded-lg font-black text-[10px] transition-all uppercase cursor-pointer ${
                          simulationActive 
                            ? 'bg-emerald-800 text-white shadow-xs' 
                            : 'bg-red-50 text-red-650 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {simulationActive ? '📡 SIMULADOR ATIVO' : '⏸️ SIMULADOR PAUSADO'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. SEÇÃO DIREITA: DETALHAMENTO GPS, MAPA INTERATIVO E HISTÓRICO */}
                <div className="lg:col-span-8 space-y-6">
                  {(() => {
                    const selectedRoute = routes.find(r => r.id === selectedRouteId);
                    if (!selectedRoute) {
                      return (
                        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-slate-450 italic shadow-xs">
                          <Truck className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-bounce" />
                          <span>Selecione uma rota na lista à esquerda para acompanhar o escoamento ou clique em "Novo Despacho" para iniciar rastreamento em tempo real.</span>
                        </div>
                      );
                    }

                    const startPreset = PRESET_COORDS[selectedRoute.start_location] || { lat: -23.3556, lng: -47.8556 };
                    const endPreset = PRESET_COORDS[selectedRoute.destination] || { lat: -23.7975, lng: -48.5133 };

                    // Coordinates list for SVG path rendering (Southeast bounds setup)
                    const minLat = -24.5;
                    const maxLat = -14.0;
                    const minLng = -57.5;
                    const maxLng = -45.5;

                    const getXY = (lat: number, lng: number) => {
                      const x = ((lng - minLng) / (maxLng - minLng)) * 750;
                      const y = (1 - (lat - minLat) / (maxLat - minLat)) * 400;
                      return { x, y };
                    };

                    const startXY = getXY(startPreset.lat, startPreset.lng);
                    const endXY = getXY(endPreset.lat, endPreset.lng);
                    const currentXY = getXY(selectedRoute.current_lat, selectedRoute.current_lng);

                    // De-serialize history coordinates logs
                    let historyLogs: any[] = [];
                    try {
                      historyLogs = typeof selectedRoute.coordinates_history === 'string'
                        ? JSON.parse(selectedRoute.coordinates_history)
                        : (selectedRoute.coordinates_history || []);
                    } catch (e) {
                      historyLogs = [];
                    }

                    return (
                      <div className="space-y-6">
                        
                        {/* HEADER DETAILS CARD */}
                        <div className="bg-[#0c1c13] text-white rounded-2xl p-6 shadow-md border-l-4 border-amber-500">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                            <div>
                              <p className="text-[10px] font-extrabold text-amber-500 font-mono tracking-wider uppercase flex items-center space-x-1">
                                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                                <span>MONITORAMENTO ATIVO DE ESCOAMENTO</span>
                              </p>
                              <h3 className="text-xl font-bold mt-1 tracking-tight">{selectedRoute.driver_name}</h3>
                              <p className="text-xs text-emerald-300 font-mono">{selectedRoute.vehicle_type} — Placa: <strong>{selectedRoute.vehicle_plate}</strong></p>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">Manifesto de Origem</span>
                              <p className="text-xs font-black mt-1 text-slate-100">{selectedRoute.start_location} <span className="text-amber-500">➜</span> {selectedRoute.destination}</p>
                              <span className="text-[10px] text-slate-300 font-mono italic block mt-0.5">Partida: {selectedRoute.started_at}</span>
                            </div>
                          </div>

                          {/* TELEMETRY READINGS BAR */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-center">
                            <div className="bg-emerald-990/40 p-3 rounded-xl border border-emerald-900">
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Velocidade</span>
                              <p className="text-base font-black text-white mt-1 font-mono">{selectedRoute.speed} <span className="text-2xs text-slate-400">km/h</span></p>
                            </div>
                            <div className="bg-emerald-990/40 p-3 rounded-xl border border-emerald-900">
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Combustível</span>
                              <p className="text-base font-black text-amber-400 mt-1 font-mono">{selectedRoute.fuel_level}%</p>
                            </div>
                            <div className="bg-emerald-990/40 p-3 rounded-xl border border-emerald-900">
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Carga Declarada</span>
                              <p className="text-xs font-black text-white mt-1 truncate max-w-[150px] mx-auto italic">"{selectedRoute.cargo_description}"</p>
                            </div>
                            <div className="bg-emerald-990/40 p-3 rounded-xl border border-emerald-900">
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Última Transmissão</span>
                              <p className="text-[10px] font-bold text-slate-200 mt-1 line-clamp-2 leading-tight">"{selectedRoute.last_event}"</p>
                            </div>
                          </div>
                        </div>

                        {/* VECTOR HIGH POLISHED INTERACTIVE MAP */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900">Painel de Escoamento Multirregional ({selectedRoute.start_location} ➜ {selectedRoute.destination})</h3>
                              <p className="text-2xs text-slate-500 uppercase font-black font-mono tracking-wider">Projeção Geográfica Veterinária & Agrícola</p>
                            </div>
                            <div className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full font-mono flex items-center space-x-1.5 border border-emerald-200">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              <span>Coordenadas GPS: {selectedRoute.current_lat.toFixed(5)}, {selectedRoute.current_lng.toFixed(5)}</span>
                            </div>
                          </div>

                          <div className="bg-[#121915] rounded-xl overflow-hidden relative border border-slate-800 shadow-inner h-[400px]">
                            <svg className="w-full h-full" viewBox="0 0 750 400">
                              {/* Grid lines backdrop (Control Center) */}
                              <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
                              </pattern>
                              <rect width="100%" height="100%" fill="url(#mapGrid)" />

                              {/* State boundary indicator rings */}
                              <circle cx="120" cy="80" r="100" fill="#fbbf24" fillOpacity="0.015" stroke="#fbbf24" strokeOpacity="0.1" strokeDasharray="4,4" />
                              <text x="50" y="45" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace" opacity="0.4">REGIÃO MATO GROSSO (MT)</text>

                              <circle cx="560" cy="330" r="130" fill="#047857" fillOpacity="0.02" stroke="#047857" strokeOpacity="0.1" strokeDasharray="4,4" />
                              <text x="590" y="225" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="monospace" opacity="0.4">CENTRAL SÃO PAULO (SP)</text>

                              {/* Interstate connection highway */}
                              <line x1="120" y1="80" x2="520" y2="300" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="3,3" />

                              {/* ALL CITIES PRESETS NODES MARKERS */}
                              {Object.entries(PRESET_COORDS).map(([name, coords]) => {
                                const xy = getXY(coords.lat, coords.lng);
                                const isEndpoint = name === selectedRoute.start_location || name === selectedRoute.destination;
                                return (
                                  <g key={name} className="cursor-help" opacity={isEndpoint ? 1 : 0.45}>
                                    <circle 
                                      cx={xy.x} 
                                      cy={xy.y} 
                                      r={isEndpoint ? 6 : 4} 
                                      fill={name.includes('MT') ? '#fbbf24' : '#10b981'} 
                                    />
                                    {isEndpoint && (
                                      <circle 
                                        cx={xy.x} 
                                        cy={xy.y} 
                                        r={10} 
                                        fill="none" 
                                        stroke={name.includes('MT') ? '#fbbf24' : '#10b981'} 
                                        strokeOpacity="0.4"
                                        className="animate-ping"
                                      />
                                    )}
                                    <text 
                                      x={xy.x + 8} 
                                      y={xy.y + 3} 
                                      fill="#e2e8f0" 
                                      fontSize="8" 
                                      fontWeight="bold" 
                                      fontFamily="sans-serif"
                                      letterSpacing="0.05em"
                                    >
                                      {name}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* FULL PATH LINE */}
                              <line 
                                x1={startXY.x} 
                                y1={startXY.y} 
                                x2={endXY.x} 
                                y2={endXY.y} 
                                stroke="#10b981" 
                                strokeWidth="3" 
                                strokeOpacity="0.15" 
                              />
                              <line 
                                x1={startXY.x} 
                                y1={startXY.y} 
                                x2={endXY.x} 
                                y2={endXY.y} 
                                stroke="#f59e0b" 
                                strokeWidth="1.5" 
                                strokeDasharray="5,5" 
                                strokeOpacity="0.6" 
                              />

                              {/* DRIVEN / PROGRESS COMPLETED VECTOR OVERLAY LINE */}
                              <line 
                                x1={startXY.x} 
                                y1={startXY.y} 
                                x2={currentXY.x} 
                                y2={currentXY.y} 
                                stroke="#059669" 
                                strokeWidth="3.5" 
                                strokeOpacity="0.8" 
                              />

                              {/* DRIVER GPS LIVE CORNER */}
                              <g>
                                <circle 
                                  cx={currentXY.x} 
                                  cy={currentXY.y} 
                                  r={14} 
                                  fill="#fbbf24" 
                                  fillOpacity="0.25" 
                                  className={selectedRoute.status === 'Ativa' ? 'animate-ping' : ''}
                                  style={{ animationDuration: '3s' }}
                                />
                                <circle 
                                  cx={currentXY.x} 
                                  cy={currentXY.y} 
                                  r={6.5} 
                                  fill={selectedRoute.status === 'Ativa' ? '#f59e0b' : '#10b981'} 
                                  stroke="#ffffff" 
                                  strokeWidth="1.5"
                                />
                              </g>
                            </svg>

                            {/* HOVER EXPLANATORY BANNER overlay */}
                            <div className="absolute bottom-3 left-3 right-3 bg-[#0c130f]/80 p-2.5 rounded-lg border border-emerald-900 flex justify-between text-[10px] font-mono text-slate-350">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span>Origem: {selectedRoute.start_location} ({startPreset.lat.toFixed(2)}, {startPreset.lng.toFixed(2)})</span>
                              </span>
                              <span>➜</span>
                              <span>Destino: {selectedRoute.destination} ({endPreset.lat.toFixed(2)}, {endPreset.lng.toFixed(2)})</span>
                            </div>
                          </div>
                        </div>

                        {/* DRIVER SIMULATION PROGRESS CONTROL MODIFERS */}
                        {selectedRoute.status === 'Ativa' && (
                          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div>
                                <h3 className="text-xs font-bold text-slate-800">Controles de Transmissão Manual (Simulação)</h3>
                                <p className="text-[10px] text-slate-400">Intervenções imediatas de telemetria no veículo do motorista.</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => triggerStepProgress(selectedRoute.id, 10)}
                                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] hover:bg-amber-600 transition-all uppercase flex items-center space-x-1 cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 shrink-0" />
                                  <span>Adiantar Rodagem (+10%)</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => triggerStepProgress(selectedRoute.id, 100 - selectedRoute.progress)}
                                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] hover:bg-slate-800 font-bold transition-all uppercase cursor-pointer"
                                >
                                  Finalizar Rota Agora!
                                </button>
                              </div>
                            </div>

                            <form onSubmit={manualEventReport} className="flex gap-2.5">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={customEventText}
                                  onChange={(e) => setCustomEventText(e.target.value)}
                                  placeholder="Digite um evento customizado de estrada (Ex: Combustível reabastecido no Posto Paraná / Pedágio Concluído)"
                                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-emerald-800"
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                className="px-5 py-2 bg-emerald-800 text-white font-extrabold rounded-xl text-xs hover:bg-emerald-900 transition-all hover:shadow-xs cursor-pointer tracking-wider shrink-0 uppercase"
                              >
                                Gravar Evento diário
                              </button>
                            </form>
                          </div>
                        )}

                        {/* HISTORICAL COORDINATES ROAD DIARY */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
                          <h3 className="text-xs font-bold text-slate-950 uppercase tracking-widest font-mono mb-4 flex items-center space-x-1.5 border-b pb-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span>Diário de Bordo Geográfico & logs GPS</span>
                          </h3>

                          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                            {historyLogs.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum evento registrado no diário de bordo.</p>
                            ) : (
                              [...historyLogs].reverse().map((log, lidx) => (
                                <div key={lidx} className="flex items-start space-x-4 text-xs font-sans border-l-2 border-slate-200 pl-4 py-1 relative">
                                  {/* Milestone node bubble indicator */}
                                  <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-slate-100 border border-slate-400 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                      <p className="font-extrabold text-slate-900">{log.event || 'Sinal transmitido ao satélite regional.'}</p>
                                      <span className="text-[10px] text-slate-450 font-mono italic shrink-0">{log.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-3.5 mt-1 text-[10px] font-mono text-slate-500 font-bold">
                                      <span>LatLng: {Number(log.lat).toFixed(4)}, {Number(log.lng).toFixed(4)}</span>
                                      <span>•</span>
                                      <span>Velocidade registrada: <strong className="text-slate-700">{log.speed || 0} km/h</strong></span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            )}

            {/* SUBTAB 6: DADOS E DIVULGAÇÃO DA INSTITUIÇÃO */}
            {activeSubTab === 'settings' && (
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Editar Dados de Divulgação</h2>
                  <p className="text-xs text-slate-500 font-medium">Atualize os slogans, informações institucionais, história e contatos organizados por abas da mesma forma que os menus do site.</p>
                </div>

                {/* NESTED SETTINGS TABS */}
                <div className="flex border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {[
                    { key: 'home', label: '🏠 Canal Início (Home)' },
                    { key: 'sobre', label: '📖 Institucional (Sobre Nós)' },
                    { key: 'produtos', label: '🍊 Segmentos (Produtos)' },
                    { key: 'contato', label: '📞 Canais de Contato' }
                  ].map((sub) => (
                    <button
                      key={sub.key}
                      type="button"
                      onClick={() => setActiveEditTab(sub.key as any)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x -mb-px transition-all cursor-pointer ${
                        activeEditTab === sub.key
                          ? 'bg-slate-50 border-slate-200 border-b-transparent text-emerald-800 font-black'
                          : 'bg-white border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* TAB 1: HOME */}
                  {activeEditTab === 'home' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-150 text-xs text-emerald-900 mb-4 font-medium">
                        Configure as frases de impacto e de apresentação dispostas na página de recepção (Home).
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-705 tracking-wide uppercase">
                          Slogan Principal da Família Shigueno
                        </label>
                        <input
                          type="text"
                          value={siteMotto}
                          onChange={(e) => setSiteMotto(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none"
                          placeholder="Ex: Uma empresa sempre preocupada com a qualidade de vida."
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: OVER / HISTÓRIA */}
                  {activeEditTab === 'sobre' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-150 text-xs text-emerald-900 mb-2 font-medium">
                        Configure o legado histórico estruturado do Sr. Haruo Shigueno para inspirar o público institucional.
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>Introdução Histórica (Chegada do Patriarca Sr. Haruo Shigueno)</span>
                          <span className="text-slate-400 text-[10px]">Introdução em destaque</span>
                        </label>
                        <textarea
                          rows={3}
                          value={siteAboutIntro}
                          onChange={(e) => setSiteAboutIntro(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Breve sumário sobre a imigração em 1932..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>História de Fundação (Avicultura e deparação com o campo)</span>
                          <span className="text-slate-400 text-[10px]">Parágrafo central principal</span>
                        </label>
                        <textarea
                          rows={5}
                          value={siteAboutFull}
                          onChange={(e) => setSiteAboutFull(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Detalhes completos sobre Mogi das Cruzes, São José dos Campos e Tatuí..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>Diversificação Agrícola e Progresso das Fazendas</span>
                          <span className="text-slate-400 text-[10px]">Última seção</span>
                        </label>
                        <textarea
                          rows={4}
                          value={siteAboutDiversification}
                          onChange={(e) => setSiteAboutDiversification(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Explicação sobre a citricultura, café e adubo de postura das aves..."
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PRODUTOS / PILARES */}
                  {activeEditTab === 'produtos' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-150 text-xs text-emerald-900 mb-2 font-medium">
                        Edite os textos descritivos que aparecem nas abas técnicas de cada categoria em nosso catálogo de produtos do campo.
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>🥚 Avicultura de Postura - Descrição Executiva</span>
                          <span className="text-slate-400 text-[10px]">Fazenda Nova Aliança Tatuí (SP)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={siteProdAvicultura}
                          onChange={(e) => setSiteProdAvicultura(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Descrição da produção seletiva de ovos..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>🍊 Citricultura Técnica - Descrição Sazonal</span>
                          <span className="text-slate-400 text-[10px]">Fazendas Califórnia e Aliança</span>
                        </label>
                        <textarea
                          rows={3}
                          value={siteProdCitricultura}
                          onChange={(e) => setSiteProdCitricultura(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Descrição do cultivo orgânico de citros com esterco aviário..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>☕ Cafeicultura de Altitude - Descrição Climatológica</span>
                          <span className="text-slate-400 text-[10px]">Fazendas de Itaí (SP)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={siteProdCafeicultura}
                          onChange={(e) => setSiteProdCafeicultura(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Descrição das linhagens de café arábica e microclima..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>🐂 Nelore Agropecuária - Cria & Recria Sustentável</span>
                          <span className="text-slate-400 text-[10px]">Santo Antônio do Leverger (MT)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={siteProdNelore}
                          onChange={(e) => setSiteProdNelore(e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none leading-relaxed"
                          placeholder="Descrição do manejo racional do rebanho Nelore..."
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CONTATO */}
                  {activeEditTab === 'contato' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-150 text-xs text-emerald-900 mb-2 font-medium">
                        Configure as informações básicas de contato disponibilizadas no rodapé e canal comercial.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">
                            E-mail Geral de Atendimento (SAC)
                          </label>
                          <input
                            type="email"
                            value={siteContactEmail}
                            onChange={(e) => setSiteContactEmail(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-mono font-semibold text-slate-800 focus:outline-none"
                            placeholder="Ex: sac@shigueno.com.br"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">
                            Telefone Comercial (Sede Administrativa Tatuí)
                          </label>
                          <input
                            type="text"
                            value={siteContactPhone}
                            onChange={(e) => setSiteContactPhone(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all rounded-xl px-4 py-3 text-xs font-mono font-semibold text-slate-800 focus:outline-none"
                            placeholder="Ex: (15) 3259-9710"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTION CONTROLS */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3.5">
                    <button
                      type="button"
                      onClick={fetchInitialData}
                      disabled={loading}
                      className="px-5 py-3 border border-slate-250 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all focus:outline-none cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reverter Alterações</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-xs transition-all shadow-sm tracking-widest uppercase flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Gravar Dados no site</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
