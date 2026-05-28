import React from 'react';
import { Briefcase, MapPin, Users, FileText, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Vacancy } from '../types';

interface VagasViewProps {
  onNavigate: (view: string) => void;
}

export default function VagasView({ onNavigate }: VagasViewProps) {
  const [vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedVacancy, setSelectedVacancy] = React.useState<Vacancy | null>(null);
  
  // Form State
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cvText, setCvText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedMessage, setSubmittedMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchActiveVacancies();
  }, []);

  const fetchActiveVacancies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vacancies?active=true');
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies || []);
      }
    } catch (e) {
      console.error('Erro ao listar vagas:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !cvText) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          vacancy_id: selectedVacancy?.id || null,
          cv_text: cvText
        })
      });
      const data = await response.json();
      if (data.success) {
        setSubmittedMessage(data.message || 'Currículo enviado com sucesso!');
        // Reset state
        setName('');
        setEmail('');
        setPhone('');
        setCvText('');
        // Smooth scroll to success
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Erro ao enviar candidatura: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar currículo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="careers-portal">
      
      {/* Careers Banner */}
      <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mb-12 shadow-sm border border-emerald-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fca510_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">Trabalhe Conosco</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Oportunidades que Plantam o Amanhã</h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Seja na Citricultura em Buri, na Cafeicultura em Itaí, na Postura de Ovos em Tatuí, ou na criação de gado Nelore em Leverger-MT, a Shigueno busca profissionais que partilham do amor pela terra e pelo trabalho bem-feito.
          </p>
        </div>
      </div>

      {submittedMessage ? (
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm animate-fade-in">
          <CheckCircle className="w-16 h-16 text-emerald-700 mx-auto" />
          <h2 className="text-2xl font-extrabold text-emerald-900">Inscrição Efetuada com Sucesso!</h2>
          <p className="text-sm text-slate-650 leading-relaxed">
            {submittedMessage} Nosso departamento de Recursos Humanos em Tatuí-SP revisará as informações de sua experiência e entrará em contato em caso de sinergia com o perfil.
          </p>
          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => {
                setSubmittedMessage(null);
                setSelectedVacancy(null);
                fetchActiveVacancies();
              }}
              className="bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-905 transition-all"
            >
              Ver Outras Vagas
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-white border border-slate-300 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Vacancy lists Column */}
          <div className={`${selectedVacancy ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6 transition-all duration-350`}>
            <div className="border-b border-slate-150 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Vagas de Força Aberta</h2>
                <p className="text-xs text-slate-500">Selecione uma vaga para expandir os requisitos e enviar seu currículo.</p>
              </div>
              <span className="text-xs font-bold text-emerald-850 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {vacancies.length} ativas
              </span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm italic">
                Buscando vagas no banco de dados de Tatuí...
              </div>
            ) : vacancies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {vacancies.map((v) => (
                  <div
                    key={v.id}
                    id={`vacancy-card-${v.id}`}
                    onClick={() => {
                      setSelectedVacancy(v);
                      // Smooth scroll candidate form area on small screens
                      if (window.innerWidth < 1024) {
                        setTimeout(() => {
                          const el = document.getElementById('application-form-panel');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedVacancy?.id === v.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-150 hover:border-emerald-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold bg-amber-100 text-amber-850 px-2.5 py-0.5 rounded font-mono uppercase">
                        {v.department}
                      </span>
                      <span className="inline-flex items-center text-xs text-slate-500 font-semibold font-mono">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                        {v.location}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-950 font-sans">{v.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{v.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Consulte e Candidate-se
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedVacancy?.id === v.id ? 'translate-x-1 text-emerald-800' : 'text-slate-350'}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-10 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-650 text-sm font-semibold">Sem vagas específicas publicadas no momento.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Mesmo sem vagas abertas, você pode enviar seu currículo espontâneo. Ele ficará em destaque em nosso banco de dados no painel do administrador da Shigueno.
                </p>
                <button
                  onClick={() => setSelectedVacancy({
                    id: 0,
                    title: 'Banco de Talentos / Envio Espontâneo',
                    department: 'Geral',
                    description: 'Envie seus dados para cadastro reserva e futuras oportunidades em qualquer um de nossos setores (Postura, Citrus, Café ou Nelore MT).',
                    location: 'Tatuí-SP ou Leverger-MT',
                    requirements: 'Interesse genuíno no agronegócio e disposição para aprender e crescer com a família Shigueno.',
                    status: 'Ativa'
                  })}
                  className="bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-emerald-900 transition-colors"
                >
                  Criar Candidatura Espontânea
                </button>
              </div>
            )}
          </div>

          {/* Application Form Column */}
          {selectedVacancy && (
            <div 
              id="application-form-panel" 
              className="lg:col-span-6 bg-slate-50 border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6 animate-slide-in relative"
            >
              {/* Reset selection button */}
              <button
                onClick={() => setSelectedVacancy(null)}
                className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-650"
              >
                Fechar [X]
              </button>

              <div className="space-y-2 border-b border-slate-150 pb-4">
                <p className="text-xs font-bold text-amber-600 uppercase font-mono">Você está se candidatando para:</p>
                <h3 className="text-xl font-extrabold text-slate-950 font-sans tracking-tight">{selectedVacancy.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{selectedVacancy.description}</p>
                <div className="mt-2.5 p-3.5 bg-emerald-50 rounded-xl text-xs text-emerald-950 leading-relaxed font-sans">
                  <strong>Requisitos Exigidos:</strong> {selectedVacancy.requirements}
                </div>
              </div>

              {/* Recruitment Application Form */}
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ficha de Inscrição Unificada</h4>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-250 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-emerald-800 focus:ring-1 focus:ring-emerald-700 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail para Contato *</label>
                    <input
                      type="email"
                      required
                      placeholder="seu.nome@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-250 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-emerald-800 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: (15) 99885-4422"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-250 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-emerald-800 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Resumo Curricular / Experiência *</label>
                    <span className="text-[10px] text-slate-400 font-mono">Copie e cole suas experiências aqui</span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    placeholder="Descreva brevemente onde trabalhou, maquinários que opera, fazendas onde trabalhou ou referências de trabalhos rurais anteriores..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    className="w-full bg-white border border-slate-250 px-4 py-3 rounded-xl text-xs font-medium focus:outline-emerald-800 leading-relaxed font-mono"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  {submitting ? 'Enviando Ficha...' : 'Enviar Currículo para o RH'}
                </button>
                <p className="text-[10px] text-slate-450 leading-relaxed text-center">
                  * Seus dados serão transmitidos de forma segura diretamente para o banco de dados SQLite do painel do Gestor Shigueno.
                </p>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
