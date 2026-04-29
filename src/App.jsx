import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Bell,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Store,
  ArrowRight,
  Menu,
  X,
  Camera,
  Printer,
  Trash2,
  Edit3,
  BarChart3,
  ClipboardCheck,
  Calendar,
  UserCheck,
  PlayCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  MinusCircle,
  FileText,
  Filter,
  TrendingDown,
  TrendingUp,
  Target,
  Plus,
  Save,
  Users,
  Layers,
  ShieldCheck,
  Maximize2,
  Tag,
  Moon,
  Sun
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://tsjyqcrqwssepnjipwhw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzanlxY3Jxd3NzZXBuamlwd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjI4ODksImV4cCI6MjA4MzE5ODg4OX0.v9sJm0MqV4rPZ0Vzvz-97yZFdvCKgksiTxN8dGg0x7M';

// Constante de Meta
const META_GLOBAL = 100; 

// --- UTILITÁRIOS ---
const toCamel = (s) => s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const keysToCamel = (o) => {
  if (Array.isArray(o)) return o.map(keysToCamel);
  if (o !== null && typeof o === 'object') {
    return Object.keys(o).reduce((acc, key) => {
      const newKey = toCamel(key);
      acc[newKey] = keysToCamel(o[key]);
      return acc;
    }, {});
  }
  return o;
};

const getPenaltyPoints = (severity) => {
  const points = { 'gravissima': 50, 'grave': 4, 'media': 2.5, 'leve': 1 };
  return points[severity] || 0;
};

// --- COMPONENTES DE UI BASE (DESIGN SYSTEM) ---

const Button = ({ children, variant = 'primary', className = '', isDark = true, ...props }) => {
  const base = "px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: isDark 
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700" 
      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm",
    outline: isDark 
      ? "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800" 
      : "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost: isDark 
      ? "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" 
      : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", isDark = true }) => (
  <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl overflow-hidden border shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = 'neutral', isDark = true }) => {
  const types = {
    success: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200",
    danger: isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200",
    neutral: isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200",
    primary: isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-700 border-blue-200"
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${types[type]}`}>{children}</span>;
};

// --- COMPONENTES DA SIDEBAR ---

function NavItem({ icon, label, active, onClick, collapsed, isDark = true }) {
  const activeLight = "bg-blue-50 text-blue-700 font-semibold";
  const inactiveLight = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const activeDark = "bg-blue-500/10 text-blue-400 font-semibold";
  const inactiveDark = "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200";

  const stateClass = active 
    ? (isDark ? activeDark : activeLight) 
    : (isDark ? inactiveDark : inactiveLight);

  return (
    <div className="relative group flex justify-center">
      <button
        onClick={onClick}
        className={`
          flex items-center transition-colors duration-200 rounded-lg text-sm
          ${collapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2.5 gap-3'}
          ${stateClass}
        `}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
      
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] shadow-lg">
          {label}
        </div>
      )}
    </div>
  );
}

// --- GRÁFICO PERFORMANCE ---

function PerformanceBarChart({ data, isDark }) {
  const maxScore = 100;
  const target = META_GLOBAL;
  
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-6">
      <div 
        className="relative h-64 flex items-end justify-start px-2 pt-10" 
        style={{ minWidth: `${Math.max(data.length * 60, 600)}px` }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map(val => (
            <div key={val} className="w-full flex items-center gap-2">
              <span className={`text-xs font-medium w-8 text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{val}%</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            </div>
          ))}
        </div>

        {/* Meta Line */}
        <div 
          className="absolute left-10 right-0 border-t border-dashed border-emerald-500/60 z-10 flex items-center"
          style={{ bottom: `${target}%` }}
        >
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full -ml-10">Meta {target}%</span>
        </div>

        {/* Bars */}
        <div className="relative flex-1 flex items-end justify-around gap-2 ml-10 h-full">
          {data.map((item, idx) => {
            const isSuccess = item.score >= target;
            const barHeight = (item.score / maxScore) * 100;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end" style={{ maxWidth: '40px' }}>
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-none">
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap mb-2 relative`}>
                    {item.score.toFixed(1)}%
                  </div>
                </div>

                {/* Bar Container */}
                <div className={`w-full rounded-t-md relative transition-all duration-700 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} h-full flex flex-col justify-end`}>
                  <div 
                    className={`w-full rounded-t-md transition-all duration-1000 ease-out ${isSuccess ? 'bg-blue-500' : 'bg-slate-400'}`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                {/* Label */}
                <div className="absolute top-[105%] rotate-45 origin-top-left whitespace-nowrap">
                  <span className={`text-[10px] font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- APLICAÇÃO PRINCIPAL ---

export default function App() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEval, setSelectedEval] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('vq_theme') !== 'light');
  const [db, setDb] = useState({ users: [], stores: [], evaluations: [], indicators: [], questions: [], channels: [], managers: [] });

  useEffect(() => {
    let clientInstance = null;
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
        if (!clientInstance) {
          clientInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: false, autoRefreshToken: false }
          });
          setSupabaseClient(clientInstance);
        }
      } catch (e) {
        console.error("Erro ao carregar Supabase:", e);
      }
    };
    initSupabase();

    const loggedUser = localStorage.getItem('vq_user');
    if (loggedUser) setUser(JSON.parse(loggedUser));
  }, []);

  useEffect(() => {
    if (supabaseClient) fetchData();
  }, [supabaseClient]);

  useEffect(() => {
    localStorage.setItem('vq_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchData = async () => {
    if (!supabaseClient) return;
    try {
      const [u, m, s, c, i, q, e, d] = await Promise.all([
        supabaseClient.from('users').select('*'),
        supabaseClient.from('managers').select('*'),
        supabaseClient.from('stores').select('*'),
        supabaseClient.from('channels').select('*'),
        supabaseClient.from('indicators').select('*'),
        supabaseClient.from('questions').select('*'),
        supabaseClient.from('evaluations').select('*').order('date', { ascending: false }).limit(2000),
        supabaseClient.from('evaluation_details').select('id, evaluation_id, question_id, answer, cp_validated').limit(15000)
      ]);

      const formattedEvals = keysToCamel(e.data || []).map(ev => ({
        ...ev,
        details: keysToCamel(d.data || []).filter(det => det.evaluationId == ev.id)
      }));

      setDb({
        users: keysToCamel(u.data || []),
        managers: keysToCamel(m.data || []),
        stores: keysToCamel(s.data || []),
        channels: keysToCamel(c.data || []),
        indicators: keysToCamel(i.data || []),
        questions: keysToCamel(q.data || []),
        evaluations: formattedEvals
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleShowReport = async (ev) => {
    if (!supabaseClient) {
      setSelectedEval(ev);
      return;
    }
    try {
      const { data, error } = await supabaseClient
        .from('evaluation_details')
        .select('*')
        .eq('evaluation_id', ev.id);
        
      if (error) throw error;
      
      setSelectedEval({
        ...ev,
        details: keysToCamel(data || [])
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes da avaliação:", error);
      alert("Houve um erro ao buscar os detalhes e imagens desta avaliação.");
      setSelectedEval(ev);
    }
  };

  const handleLogin = (email, password) => {
    supabaseClient.from('users').select('*').eq('email', email.toLowerCase()).single().then(({data}) => {
       if (data && data.password === password) {
         const u = { 
           id: data.id, 
           name: data.name, 
           email: data.email, 
           role: data.role,
           storeId: data.store_id,
           accessibleStores: data.accessible_stores || []
         };
         setUser(u);
         localStorage.setItem('vq_user', JSON.stringify(u));
       } else alert("Dados de acesso incorretos.");
    });
  };

  const logout = () => {
    localStorage.removeItem('vq_user');
    window.location.reload();
  };

  if (loading || !supabaseClient) return (
    <div className={`h-screen w-full flex flex-col items-center justify-center text-center transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className={`mt-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} animate-pulse`}>Carregando sistema...</p>
    </div>
  );

  if (!user) return <LoginView onLogin={handleLogin} isDark={isDark} />;

  const isAdmin = user.role === 'admin';

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 border-r hidden lg:flex flex-col no-print ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-6 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0">VQ</div>
          {isSidebarOpen && <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white truncate">Portal Qualidade</span>}
        </div>

        <nav className="mt-6 px-3 flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Visão Geral" active={activeTab === 'home'} onClick={() => setActiveTab('home')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<BarChart3 size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<History size={18}/>} label="Histórico" active={activeTab === 'histórico'} onClick={() => setActiveTab('histórico')} collapsed={!isSidebarOpen} isDark={isDark} />
          
          {isAdmin && (
            <div className="pt-6">
              {isSidebarOpen ? (
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Administração</div>
              ) : (
                <div className={`h-px my-6 mx-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              )}
              <div className="space-y-1">
                <NavItem icon={<PlusCircle size={18}/>} label="Nova Auditoria" active={activeTab === 'new'} onClick={() => setActiveTab('new')} collapsed={!isSidebarOpen} isDark={isDark} />
                <NavItem icon={<Settings size={18}/>} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} isDark={isDark} />
              </div>
            </div>
          )}
        </nav>

        <div className="p-4">
           <NavItem icon={<LogOut size={18} />} label="Encerrar Sessão" active={false} onClick={logout} collapsed={!isSidebarOpen} isDark={isDark} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 flex flex-col h-screen ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className={`sticky top-0 z-40 backdrop-blur-xl px-8 py-4 flex items-center justify-between border-b no-print transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg transition-colors hidden lg:block ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold capitalize text-slate-900 dark:text-white">
              {activeTab === 'settings' ? 'Configurações do Sistema' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-lg border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role === 'manager' ? 'Gestora' : user.role === 'admin' ? 'Administrador' : 'Supervisora'}</span>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div id="content-container" className="flex-1 overflow-y-auto no-scrollbar p-8 max-w-7xl mx-auto w-full no-print">
          {activeTab === 'home' && <HomeView db={db} user={user} setActiveTab={setActiveTab} onShowReport={handleShowReport} isDark={isDark} />}
          {activeTab === 'dashboard' && <DashboardView db={db} user={user} isDark={isDark} />}
          {activeTab === 'histórico' && <HistoryView db={db} user={user} onShowReport={handleShowReport} isDark={isDark} supabaseClient={supabaseClient} fetchData={fetchData} />}
          {activeTab === 'new' && isAdmin && <NewAuditView db={db} supabaseClient={supabaseClient} onComplete={() => { fetchData(); setActiveTab('histórico'); }} isDark={isDark} />}
          {activeTab === 'settings' && isAdmin && <ManagementView db={db} supabaseClient={supabaseClient} fetchData={fetchData} isDark={isDark} />}
        </div>
      </main>

      {/* MODAL DE RELATÓRIO */}
      {selectedEval && (
        <div id="report-portal" className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 no-print">
          <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-xl flex flex-col relative animate-in zoom-in-95 duration-200`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">VQ</div>
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Relatório de Auditoria</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()} className="py-2 text-xs" isDark={isDark}><Printer size={16}/> Imprimir</Button>
                <button onClick={() => setSelectedEval(null)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><X size={20}/></button>
              </div>
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              <ReportContent evaluation={selectedEval} db={db} isDark={isDark} onExpandImage={setExpandedImg} />
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZADOR DE IMAGEM EXPANDIDA */}
      {expandedImg && (
        <div 
          className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setExpandedImg(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full">
            <X size={24} />
          </button>
          <img 
            src={expandedImg} 
            alt="Evidência Expandida" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
          />
        </div>
      )}

      <style>{`
        @media print {
          body, html { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          #content-container, aside, header, #report-portal { display: none !important; }
          @page { size: auto; margin: 10mm; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ db, user, setActiveTab, onShowReport, isDark }) {
  const auditList = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.evaluations, user]);
  
  const avg = auditList.length ? (auditList.reduce((a, b) => a + b.score, 0) / auditList.length).toFixed(2) : "0.00";
  const criticalCount = auditList.filter(e => e.score < 80).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className={`p-8 sm:p-10 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden`}>
        <div className="relative z-10">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Portal Qualidade e Conformidade</h1>
          <p className={`mt-2 text-base ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-xl`}>Sistema centralizado de gestão técnica, auditorias de padronização e visualização de indicadores da rede.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setActiveTab('dashboard')} isDark={isDark}><BarChart3 size={16}/> Ver Dashboard</Button>
            {user.role === 'admin' && <Button variant="secondary" onClick={() => setActiveTab('new')} isDark={isDark}><PlusCircle size={16}/> Nova Avaliação</Button>}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 dark:opacity-10 pointer-events-none hidden md:block">
           <ShieldCheck className="w-full h-full text-blue-600 scale-150 transform translate-x-1/4" />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard isDark={isDark} title="Média de Desempenho" value={`${avg}%`} icon={<TrendingUp className="text-emerald-500" size={24}/>} />
        <StatCard isDark={isDark} title="Alertas de Conformidade" value={criticalCount} icon={<AlertCircle className="text-amber-500" size={24}/>} />
        <StatCard isDark={isDark} title="Unidades Ativas" value={db.stores.length} icon={<Store className="text-blue-500" size={24}/>} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Clock size={18} className="text-blue-500"/> Registros Recentes
          </h3>
          <div className="space-y-3">
            {auditList.slice(0, 5).map((ev, idx) => { 
              const store = db.stores.find(s => s.id === ev.storeId); 
              return (
                <Card key={ev.id} isDark={isDark} className={`p-4 flex items-center gap-4 transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`} onClick={() => onShowReport(ev)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ev.score >= 80 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                    {ev.score >= 80 ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Auditoria na unidade <span className="font-semibold">{store?.name}</span></p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Conduzida por {ev.evaluator} em {new Date(ev.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className={`font-semibold text-sm px-2.5 py-1 rounded-md ${ev.score >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                    {Number(ev.score).toFixed(1)}%
                  </div>
                </Card>
              ); 
            })}
            {auditList.length === 0 && <p className="text-sm text-slate-500 py-4">Nenhum registro encontrado.</p>}
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <Card isDark={isDark} className="p-6 h-full flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-600 to-indigo-700 border-none">
            <h4 className="text-lg font-medium text-blue-100 mb-6">Média Geral da Rede</h4>
            <div className="w-40 h-40 rounded-full border-8 border-blue-400/30 flex items-center justify-center mb-6">
              <span className="text-5xl font-bold text-white">{avg}<span className="text-2xl">%</span></span>
            </div>
            <p className="text-sm text-blue-100 opacity-90 max-w-[200px]">Representa o índice consolidado de aderência aos padrões de qualidade.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ManagementView({ db, supabaseClient, fetchData, isDark }) {
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterChannelId, setFilterChannelId] = useState('all');

  const config = {
    users: { title: "Usuários", icon: <Users size={16}/>, table: "users" },
    managers: { title: "Gestoras", icon: <UserCheck size={16}/>, table: "managers" },
    stores: { title: "Lojas", icon: <Store size={16}/>, table: "stores" },
    channels: { title: "Canais", icon: <Layers size={16}/>, table: "channels" },
    indicators: { title: "Indicadores", icon: <Target size={16}/>, table: "indicators" },
    questions: { title: "Perguntas", icon: <FileText size={16}/>, table: "questions" }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    const { error } = await supabaseClient.from(config[activeSubTab].table).delete().eq('id', id);
    if (error) alert("Erro ao excluir: " + error.message);
    else fetchData();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const payload = {};
    Object.keys(data).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (snakeKey === 'accessible_stores') {
        payload[snakeKey] = data[key] ? data[key].split(',').map(id => parseInt(id.trim())) : [];
      } else {
        payload[snakeKey] = data[key] === "" ? null : data[key];
      }
    });

    let action;
    if (editingItem) action = supabaseClient.from(config[activeSubTab].table).update(payload).eq('id', editingItem.id);
    else action = supabaseClient.from(config[activeSubTab].table).insert([payload]);

    const { error } = await action;
    if (error) alert("Erro ao salvar: " + error.message);
    else { setIsModalOpen(false); setEditingItem(null); fetchData(); }
  };

  const filteredData = useMemo(() => {
    let list = db[activeSubTab] || [];
    if (filterChannelId === 'all') return list;
    if (activeSubTab === 'stores' || activeSubTab === 'indicators') return list.filter(item => item.channelId == filterChannelId);
    if (activeSubTab === 'questions') return list.filter(q => db.indicators.find(i => i.id == q.indicatorId)?.channelId == filterChannelId);
    return list;
  }, [db, activeSubTab, filterChannelId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerenciamento da estrutura do portal.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} isDark={isDark}><Plus size={16}/> Novo Registro</Button>
      </div>

      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {Object.entries(config).map(([key, val]) => (
            <button key={key} onClick={() => setActiveSubTab(key)} className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeSubTab === key ? 'border-blue-600 text-blue-600 dark:text-blue-400' : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}`}>{val.icon} {val.title}</button>
          ))}
        </div>
        {['stores', 'indicators', 'questions'].includes(activeSubTab) && (
          <div className="flex items-center gap-2 pb-3">
            <Filter size={14} className="text-slate-400" />
            <select className={`bg-transparent text-sm font-medium outline-none cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}>
              <option value="all">Todos os Canais</option>
              {db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <Card isDark={isDark} className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} font-medium`}>
              <tr><th className="px-6 py-3">Informação</th><th className="px-6 py-3">Detalhes</th><th className="px-6 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {filteredData.map(item => (
                <tr key={item.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} transition-colors group`}>
                  <td className="px-6 py-4">
                    <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.name || item.text}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.email || item.code || `ID: ${item.id}`}</p>
                  </td>
                  <td className="px-6 py-4">
                    {activeSubTab === 'users' && <Badge isDark={isDark} type={item.role === 'admin' ? 'primary' : 'neutral'}>{item.role === 'admin' ? 'Admin' : item.role === 'manager' ? 'Gestora' : 'Supervisor'}</Badge>}
                    {activeSubTab === 'managers' && <Badge isDark={isDark} type={item.status === 'Ativa' ? 'success' : 'neutral'}>{item.status}</Badge>}
                    {activeSubTab === 'stores' && <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{db.channels.find(c => c.id == item.channelId)?.name}</span>}
                    {activeSubTab === 'questions' && <Badge isDark={isDark} type={item.severity === 'gravissima' ? 'danger' : item.severity === 'grave' ? 'warning' : 'neutral'}>{item.severity}</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(item.id)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-red-900/30 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card isDark={isDark} className="w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingItem ? 'Editar' : 'Novo'} {config[activeSubTab].title}</h3>
            <form onSubmit={handleSave} className="space-y-4 text-left">
              {activeSubTab === 'users' && (<UserForm editingItem={editingItem} db={db} isDark={isDark} />)}
              {activeSubTab === 'managers' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Status" name="status" isDark={isDark} defaultValue={editingItem?.status}><option value="Ativa">Ativa</option><option value="Férias">Férias</option><option value="Desligada">Desligada</option></FormSelect></>)}
              {activeSubTab === 'stores' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormInput label="Código" name="code" isDark={isDark} defaultValue={editingItem?.code} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect><FormSelect label="Gestora" name="managerId" isDark={isDark} defaultValue={editingItem?.managerId}><option value="">Selecione...</option>{db.managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'channels' && <FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required />}
              {activeSubTab === 'indicators' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'questions' && (<><FormInput label="Texto" name="text" isDark={isDark} defaultValue={editingItem?.text} required /><FormSelect label="Gravidade" name="severity" isDark={isDark} defaultValue={editingItem?.severity}><option value="leve">Leve</option><option value="media">Média</option><option value="grave">Grave</option><option value="gravissima">Gravíssima</option></FormSelect><FormSelect label="Indicador" name="indicatorId" isDark={isDark} defaultValue={editingItem?.indicatorId}>{db.indicators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</FormSelect></>)}
              
              <div className="pt-6 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} isDark={isDark} className="flex-1">Cancelar</Button>
                <Button type="submit" isDark={isDark} className="flex-1">Salvar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function UserForm({ editingItem, db, isDark }) {
  const [role, setRole] = useState(editingItem?.role || 'manager');
  return (
    <>
      <FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required />
      <FormInput label="E-mail" name="email" isDark={isDark} type="email" defaultValue={editingItem?.email} required />
      <FormInput label="Senha" name="password" isDark={isDark} defaultValue={editingItem?.password || ''} required type="password" />
      <FormSelect label="Função" name="role" isDark={isDark} value={role} onChange={e => setRole(e.target.value)}><option value="admin">Administrador</option><option value="manager">Gestora</option><option value="supervisor">Supervisora</option></FormSelect>
      {role === 'manager' && (<FormSelect label="Unidade Vinculada (Obrigatório)" isDark={isDark} name="storeId" defaultValue={editingItem?.storeId} required><option value="">Selecione a loja...</option>{db.stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>)}
      {role === 'supervisor' && (<div className="space-y-1.5"><label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Lojas Acessíveis (IDs separados por vírgula)</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}`} name="accessibleStores" placeholder="Ex: 1, 4, 12" defaultValue={editingItem?.accessibleStores?.join(', ')} /></div>)}
    </>
  );
}

function DashboardView({ db, user, isDark }) {
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterMonth, setFilterMonth] = useState(""); 

  const filteredEvals = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    
    return list.filter(ev => {
      const matchChannel = filterChannel === 'all' || ev.channelId == filterChannel;
      const matchMonth = filterMonth === '' || ev.date?.startsWith(filterMonth);
      return matchChannel && matchMonth;
    });
  }, [db.evaluations, user, filterChannel, filterMonth]);

  const stats = useMemo(() => {
    if (!filteredEvals.length) return { audits: 0, stores: 0, conf: "0.00", inconf: "0.00" };
    const uniqueStores = new Set(filteredEvals.map(e => e.storeId)).size;
    let totalItems = 0, totalConf = 0, totalInconf = 0;
    filteredEvals.forEach(ev => {
      ev.details?.forEach(det => {
        if (det.answer === 'conforme') { totalConf++; totalItems++; }
        else if (det.answer === 'inconforme') { totalInconf++; totalItems++; }
      });
    });
    return { audits: filteredEvals.length, stores: uniqueStores, conf: totalItems > 0 ? ((totalConf / totalItems) * 100).toFixed(2) : "0.00", inconf: totalItems > 0 ? ((totalInconf / totalItems) * 100).toFixed(2) : "0.00" };
  }, [filteredEvals]);

  const rankings = useMemo(() => {
    const storeMap = {};
    const managerMap = {};
    filteredEvals.forEach(ev => {
      if (!storeMap[ev.storeId]) {
        const sObj = db.stores.find(s => s.id == ev.storeId);
        storeMap[ev.storeId] = { sum: 0, count: 0, visits: 0, name: sObj?.name || '---', code: sObj?.code || '---' };
      }
      storeMap[ev.storeId].sum += ev.score;
      storeMap[ev.storeId].count++;
      storeMap[ev.storeId].visits++;
      const store = db.stores.find(s => s.id == ev.storeId);
      if (store?.managerId) {
        if (!managerMap[store.managerId]) managerMap[store.managerId] = { sum: 0, count: 0 };
        managerMap[store.managerId].sum += ev.score;
        managerMap[store.managerId].count++;
      }
    });
    return {
      storeRank: Object.keys(storeMap).map(id => ({ id, code: storeMap[id].code, name: storeMap[id].name, score: storeMap[id].sum / storeMap[id].count, visits: storeMap[id].visits })).sort((a,b) => b.score - a.score),
      managerRank: Object.keys(managerMap).map(id => ({ name: db.managers.find(m => m.id == id)?.name || '---', score: managerMap[id].sum / managerMap[id].count })).sort((a,b) => b.score - a.score)
    };
  }, [filteredEvals, db.stores, db.managers]);

  const topProblems = useMemo(() => {
    const counts = {};
    filteredEvals.forEach(ev => { ev.details?.forEach(det => { if (det.answer === 'inconforme') counts[det.questionId] = (counts[det.questionId] || 0) + 1; }); });
    return Object.keys(counts).map(qid => ({ text: db.questions.find(q => q.id == qid)?.text || 'Pergunta Removida', count: counts[qid] })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredEvals, db.questions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Visão Geral de Dados</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Acompanhe o desempenho da rede comercial.</p>
        </div>
      </div>

      <Card isDark={isDark} className="p-4 sm:p-6 no-print">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Filter size={14}/> Filtro por Canal</label>
            <select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={filterChannel} onChange={e => setFilterChannel(e.target.value)}>
              <option value="all">Todos os Canais</option>
              {db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Calendar size={14}/> Mês Referência</label>
            <input type="month" className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => { setFilterChannel('all'); setFilterMonth(""); }} isDark={isDark}>Limpar Filtros</Button>
        </div>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard isDark={isDark} title="Auditorias Realizadas" value={stats.audits} icon={<ClipboardCheck className="text-blue-500" size={20}/>} />
        <StatCard isDark={isDark} title="Lojas Auditadas" value={stats.stores} icon={<Store className="text-indigo-500" size={20}/>} />
        <StatCard isDark={isDark} title="Taxa de Conformidade" value={`${stats.conf}%`} icon={<TrendingUp className="text-emerald-500" size={20}/>} />
        <StatCard isDark={isDark} title="Taxa de Falhas" value={`${stats.inconf}%`} icon={<TrendingDown className="text-red-500" size={20}/>} />
      </section>

      <Card isDark={isDark} className="p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Target className="text-blue-500" size={18}/> Atingimento vs Meta Global
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div> Meta atingida</div>
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-slate-400"></div> Abaixo</div>
          </div>
        </div>
        <PerformanceBarChart data={rankings.storeRank} isDark={isDark} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card isDark={isDark} className="p-6">
          <h3 className={`text-base font-semibold flex items-center gap-2 mb-6 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><Store className="text-blue-500" size={18}/> Top Perfomance (Lojas)</h3>
          <div className="space-y-3">
            {rankings.storeRank.slice(0, 5).map((s, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} transition-colors`}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${i < 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : `${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}`}>#{i+1}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.name}</span>
                </div>
                <span className={`text-sm font-semibold ${s.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.score.toFixed(1)}%</span>
              </div>
            ))}
            {rankings.storeRank.length === 0 && <div className="text-center text-sm text-slate-500 py-6">Nenhum dado disponível.</div>}
          </div>
        </Card>

        <Card isDark={isDark} className="p-6">
          <h3 className={`text-base font-semibold flex items-center gap-2 mb-6 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><UserCheck className="text-indigo-500" size={18}/> Top Perfomance (Gestoras)</h3>
          <div className="space-y-3">
            {rankings.managerRank.slice(0, 5).map((m, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} transition-colors`}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${i < 3 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : `${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}`}>#{i+1}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{m.name}</span>
                </div>
                <span className={`text-sm font-semibold ${m.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{m.score.toFixed(1)}%</span>
              </div>
            ))}
            {rankings.managerRank.length === 0 && <div className="text-center text-sm text-slate-500 py-6">Nenhum dado disponível.</div>}
          </div>
        </Card>
      </div>

      <Card isDark={isDark}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><AlertTriangle className="text-amber-500" size={18}/> Ocorrências Mais Frequentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="px-6 py-3 font-medium">Parâmetro Avaliado</th>
                <th className="px-6 py-3 font-medium text-right">Frequência de Falha</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {topProblems.map((p, i) => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className={`px-6 py-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{p.text}</td>
                  <td className="px-6 py-3 text-right">
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold">
                      {p.count}
                    </span>
                  </td>
                </tr>
              ))}
              {topProblems.length === 0 && <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-500">Nenhum registro de falha encontrado no período.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function HistoryView({ db, user, onShowReport, isDark, supabaseClient, fetchData }) {
  const [searchGestor, setSearchGestor] = useState('');
  const [searchLoja, setSearchLoja] = useState('');
  const [filterChannelId, setFilterChannelId] = useState('all');
  const [filterRange, setFilterRange] = useState('all');

  const evals = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    
    if (searchGestor) {
      list = list.filter(ev => {
        const store = db.stores.find(s => s.id == ev.storeId);
        const manager = db.managers.find(m => m.id == store?.managerId);
        return manager?.name?.toLowerCase().includes(searchGestor.toLowerCase());
      });
    }

    if (searchLoja) {
      list = list.filter(ev => {
        const store = db.stores.find(s => s.id == ev.storeId);
        return store?.name?.toLowerCase().includes(searchLoja.toLowerCase()) || store?.code?.toLowerCase().includes(searchLoja.toLowerCase());
      });
    }

    if (filterChannelId !== 'all') list = list.filter(ev => ev.channelId == filterChannelId);

    if (filterRange !== 'all') {
      list = list.filter(ev => {
        if (filterRange === '95-100') return ev.score >= 95;
        if (filterRange === '90-94') return ev.score >= 90 && ev.score < 95;
        if (filterRange === '80-89') return ev.score >= 80 && ev.score < 90;
        if (filterRange === 'abaixo-79') return ev.score < 80;
        return true;
      });
    }

    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.evaluations, db.stores, db.managers, user, searchGestor, searchLoja, filterChannelId, filterRange]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação permanentemente?")) return;
    
    const { error } = await supabaseClient.from('evaluations').delete().eq('id', id);
    if (error) alert("Erro ao excluir a avaliação: " + error.message);
    else fetchData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="mb-2">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Histórico de Auditorias</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Consulta completa aos registros realizados no sistema.</p>
      </div>

      <Card isDark={isDark} className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><UserCheck size={14}/> Gestora Responsável</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} placeholder="Buscar nome..." value={searchGestor} onChange={e => setSearchGestor(e.target.value)} /></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Store size={14}/> Loja ou Código</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} placeholder="Nome ou código..." value={searchLoja} onChange={e => setSearchLoja(e.target.value)} /></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Tag size={14}/> Canal Comercial</label><select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}><option value="all">Todos os Canais</option>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Target size={14}/> Faixa de Atingimento</label><select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} value={filterRange} onChange={e => setFilterRange(e.target.value)}><option value="all">Todas</option><option value="95-100">95% a 100%</option><option value="90-94">90% a 94%</option><option value="80-89">80% a 89%</option><option value="abaixo-79">Abaixo de 80%</option></select></div>
        </div>
      </Card>

      <Card isDark={isDark} className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} font-medium`}>
              <tr><th className="px-6 py-3">Data</th><th className="px-6 py-3">Unidade</th><th className="px-6 py-3">Canal</th><th className="px-6 py-3">Pontuação</th><th className="px-6 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {evals.map(ev => { 
                const store = db.stores.find(s => s.id == ev.storeId); 
                const channel = db.channels.find(c => c.id == ev.channelId); 
                return (
                  <tr key={ev.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} group cursor-pointer transition-colors`} onClick={() => onShowReport(ev)}>
                    <td className={`px-6 py-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{new Date(ev.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{store?.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{store?.code}</p>
                    </td>
                    <td className={`px-6 py-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{channel?.name}</td>
                    <td className="px-6 py-4"><Badge isDark={isDark} type={ev.score >= 80 ? 'success' : 'danger'}>{Number(ev.score).toFixed(1)}%</Badge></td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onShowReport(ev); }} title="Ver Detalhes" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                          <FileText size={16}/>
                        </button>
                        {user.role === 'admin' && (
                          <button onClick={(e) => handleDelete(e, ev.id)} title="Excluir Avaliação" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-red-900/30 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}>
                            <Trash2 size={16}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ); 
              })}
              {evals.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Nenhum registro localizado.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function NewAuditView({ db, supabaseClient, onComplete, isDark }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ storeId: '', date: new Date().toISOString().split('T')[0] });
  const [activeInd, setActiveInd] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const startAudit = () => {
    if (!config.storeId) return alert("Selecione uma loja para iniciar.");
    const store = db.stores.find(s => s.id == config.storeId);
    const inds = db.indicators.filter(i => i.channelId == store.channelId);
    if (!inds.length) return alert("Não existem indicadores cadastrados para o canal desta loja.");
    setActiveInd(inds[0].id);
    setStep(2);
  };

  const handleAnswer = (qId, value, cp = false, comment = "", media = []) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], value, cp, comment, media: media.length > 0 ? media : (prev[qId]?.media || []) } }));
  };

  const handleFileUpload = (qId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        setAnswers(prev => {
          const currentMedia = prev[qId]?.media || [];
          return {
            ...prev,
            [qId]: { ...prev[qId], media: [...currentMedia, { url: dataUrl, name: file.name }] }
          };
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const calculateScore = () => {
    const store = db.stores.find(s => s.id == config.storeId);
    if (!store) return 100;
    const channel = db.channels.find(c => c.id == store.channelId);
    const channelName = channel?.name?.toUpperCase() || "";

    if (channelName.includes("PCOF")) {
      const questionsInAudit = db.questions.filter(q => db.indicators.filter(i => i.channelId == store.channelId).some(i => i.id == q.indicatorId));
      let totalResponded = 0;
      let conformeCount = 0;
      questionsInAudit.forEach(q => {
        const ans = answers[q.id];
        if (ans?.value === 'conforme' || ans?.value === 'inconforme') {
          totalResponded++;
          if (ans.value === 'conforme') conformeCount++;
        }
      });
      return totalResponded > 0 ? (conformeCount / totalResponded) * 100 : 0;
    }

    let score = 100;
    const questions = db.questions.filter(q => db.indicators.filter(i => i.channelId == store.channelId).some(i => i.id == q.indicatorId));
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans?.value === 'inconforme' && !ans.cp) score -= getPenaltyPoints(q.severity);
    });
    return Math.max(0, score);
  };

  const submitAudit = async () => {
    setSubmitting(true);
    const finalScore = calculateScore();
    const evaluator = JSON.parse(localStorage.getItem('vq_user')).name;
    const { data: newEval, error: evalError } = await supabaseClient.from('evaluations').insert({ store_id: config.storeId, channel_id: db.stores.find(s => s.id == config.storeId).channelId, evaluator, score: finalScore, date: config.date }).select().single();
    
    if (evalError) {
      alert("Erro ao criar a avaliação: " + evalError.message);
      setSubmitting(false);
      return;
    }

    if (newEval) {
      const details = Object.keys(answers).map(qId => ({ evaluation_id: newEval.id, question_id: qId, answer: answers[qId].value, comment: answers[qId].comment || "", cp_validated: answers[qId].cp || false, media: answers[qId].media || [] }));
      
      if (details.length > 0) {
        const { error: detError } = await supabaseClient.from('evaluation_details').insert(details);
        if (detError) {
          alert("Alerta: A auditoria foi salva, mas ocorreu um erro ao salvar as respostas ou imagens. Erro: " + detError.message);
        }
      }
      onComplete();
    }
    setSubmitting(false);
  };

  if (step === 1) return (
    <div className="max-w-xl mx-auto space-y-8 pt-12 animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Nova Auditoria</h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure os parâmetros iniciais da inspeção de qualidade.</p>
      </div>
      <Card isDark={isDark} className="p-8 space-y-6">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Unidade a ser inspecionada</label>
          <select className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={config.storeId} onChange={e => setConfig({...config, storeId: e.target.value})}>
            <option value="">Selecione uma Unidade...</option>
            {db.stores.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Data de Referência</label>
          <input type="date" className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={config.date} onChange={e => setConfig({...config, date: e.target.value})} />
        </div>
        <div className="pt-4">
          <Button onClick={startAudit} className="w-full py-3" isDark={isDark}>Avançar para o Formulário</Button>
        </div>
      </Card>
    </div>
  );

  const store = db.stores.find(s => s.id == config.storeId); 
  const inds = db.indicators.filter(i => i.channelId == store.channelId); 
  const currentInd = inds.find(i => i.id == activeInd); 
  const questions = db.questions.filter(q => q.indicatorId == activeInd);

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative pb-32">
      <div className="w-full lg:w-64 space-y-2 lg:sticky lg:top-32 h-fit">
        {inds.map(ind => (
          <button key={ind.id} onClick={() => setActiveInd(ind.id)} className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all ${activeInd === ind.id ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : `${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}`}>
            {ind.name}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-6">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border rounded-xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentInd?.name}</h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Preencha todos os itens abaixo</p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score Parcial</span>
            <p className={`text-3xl font-bold ${calculateScore() >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{calculateScore().toFixed(1)}%</p>
          </div>
        </div>
        <div className="space-y-4">
          {questions.map(q => (
            <Card key={q.id} isDark={isDark} className="p-6">
              <div className="flex justify-between items-start gap-4 mb-6">
                <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{q.text}</p>
                <Badge isDark={isDark} type={q.severity === 'gravissima' ? 'danger' : q.severity === 'grave' ? 'warning' : 'neutral'}>{q.severity}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AnswerBtn active={answers[q.id]?.value === 'conforme'} onClick={() => handleAnswer(q.id, 'conforme')} label="Conforme" variant="success" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'inconforme'} onClick={() => handleAnswer(q.id, 'inconforme')} label="Inconforme" variant="danger" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'na'} onClick={() => handleAnswer(q.id, 'na')} label="Não se Aplica" variant="neutral" isDark={isDark} />
              </div>
              {answers[q.id]?.value === 'inconforme' && (
                <div className={`mt-6 space-y-4 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} animate-in slide-in-from-top-2`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" checked={answers[q.id]?.cp} onChange={e => handleAnswer(q.id, 'inconforme', e.target.checked, answers[q.id]?.comment)}/>
                    <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Plano de Ação/CP Validado?</span>
                  </label>
                  <textarea placeholder="Insira observações ou evidências adicionais..." className={`w-full min-h-[100px] border rounded-lg p-3 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'}`} value={answers[q.id]?.comment} onChange={e => handleAnswer(q.id, 'inconforme', answers[q.id]?.cp, e.target.value)} />
                  <Button variant="outline" onClick={() => document.getElementById(`file-q-${q.id}`).click()} className="text-xs" isDark={isDark}><Camera size={14}/> Anexar Evidência</Button>
                  <input type="file" id={`file-q-${q.id}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(q.id, e)} />
                  <div className="flex gap-3 overflow-x-auto pt-2">{answers[q.id]?.media?.map((img, i) => <img key={i} src={img.url} className={`w-20 h-20 object-cover rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />)}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="pt-8 flex justify-end">
          <Button disabled={submitting} onClick={submitAudit} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Save size={18} /> Salvar Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- AUXILIARES ADICIONAIS ---

function AnswerBtn({ active, label, onClick, variant, isDark }) {
  const styles = {
    success: active 
      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:border-emerald-600/50 hover:text-emerald-400' : 'border-slate-300 text-slate-600 hover:border-emerald-600/50 hover:text-emerald-600'}`,
    danger: active 
      ? 'bg-red-600 text-white border-red-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:border-red-600/50 hover:text-red-400' : 'border-slate-300 text-slate-600 hover:border-red-600/50 hover:text-red-600'}`,
    neutral: active 
      ? 'bg-slate-600 text-white border-slate-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`
  };
  return <button onClick={onClick} className={`px-4 py-3.5 rounded-lg text-sm font-medium border transition-colors ${styles[variant]}`}>{label}</button>;
}

function StatCard({ title, value, icon, subtitle, isDark }) { 
  return (
    <Card isDark={isDark} className="p-6 relative text-left">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>{icon}</div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
      <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</div>
      {subtitle && <div className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</div>}
    </Card>
  ); 
}

// --- VISUALIZAÇÃO DE DOSSIÊ ---

function ReportContent({ evaluation, db, isDark = true, onExpandImage }) {
  const store = db.stores.find(s => s.id == evaluation.storeId);
  const manager = db.managers.find(m => m.id == store?.managerId);
  const textColor = isDark ? 'text-slate-200' : 'text-slate-800';
  const borderColor = isDark ? 'border-slate-800' : 'border-slate-200';
  const bgCard = isDark ? 'bg-slate-800/50' : 'bg-slate-50';

  const groupedDetails = {};
  evaluation.details?.forEach(det => {
    const q = db.questions.find(q => q.id == det.questionId);
    const indId = q ? q.indicatorId : 'unknown';
    if (!groupedDetails[indId]) {
      groupedDetails[indId] = [];
    }
    groupedDetails[indId].push({ det, q: q || { text: 'Pergunta não encontrada', severity: 'neutral' } });
  });

  return (
    <div className={`space-y-8 ${textColor} text-left`}>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-b ${borderColor} pb-8`}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unidade Avaliada</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">{store?.name || 'Desconhecida'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data da Realização</p>
            <p className="text-base font-medium mt-0.5">{new Date(evaluation.date).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="space-y-4 md:text-right">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Responsável pela Unidade</p>
            <p className="text-base font-medium mt-0.5">{manager?.name || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avaliador VQ</p>
            <p className="text-base font-medium mt-0.5">{evaluation.evaluator}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${bgCard} p-5 rounded-xl border ${borderColor}`}>
          <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Score Obtido</p>
          <p className={`text-3xl font-bold ${evaluation.score >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>
            {Number(evaluation.score).toFixed(2)}%
          </p>
        </div>
        <div className={`${bgCard} p-5 rounded-xl border ${borderColor}`}>
          <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Resultado</p>
          <p className="text-xl font-bold mt-1">{evaluation.score >= 80 ? 'Aprovado' : 'Requer Atenção'}</p>
        </div>
        <div className={`${bgCard} p-5 rounded-xl border ${borderColor}`}>
          <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Penalizações</p>
          <p className="text-xl font-bold mt-1">{(100 - evaluation.score).toFixed(2)} pts</p>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-lg font-bold border-l-4 border-blue-600 pl-3">Detalhamento dos Indicadores</h4>
        
        {Object.keys(groupedDetails).length === 0 && (
          <p className="text-slate-500 italic">Nenhum detalhe técnico foi recuperado para este relatório.</p>
        )}

        {Object.keys(groupedDetails).map(indId => {
          const indicator = db.indicators.find(i => i.id == indId);
          const indName = indicator ? indicator.name : 'Removidos do Sistema';

          return (
            <div key={indId} className="space-y-3 mt-4">
              <h5 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'} border-b pb-2`}>
                {indName}
              </h5>

              <div className="space-y-3">
                {groupedDetails[indId].map(({det, q}) => {
                  let mediaArray = [];
                  try {
                    if (Array.isArray(det.media)) mediaArray = det.media;
                    else if (typeof det.media === 'string') {
                      if (det.media.startsWith('[')) mediaArray = JSON.parse(det.media);
                      else if (det.media.trim() !== '') mediaArray = [{ url: det.media }];
                    }
                  } catch (e) { }

                  return (
                    <div key={det.id} className={`${bgCard} border ${borderColor} rounded-lg p-5`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <p className="font-medium text-sm leading-relaxed flex-1">{q.text}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {det.cpValidated && <Badge isDark={isDark} type="warning">Corrigido</Badge>}
                          <Badge isDark={isDark} type={det.answer === 'conforme' ? 'success' : det.answer === 'inconforme' ? 'danger' : 'neutral'}>
                            {det.answer === 'na' ? 'N/A' : det.answer === 'conforme' ? 'Conforme' : 'Não Conforme'}
                          </Badge>
                        </div>
                      </div>

                      {det.comment && (
                        <div className={`mt-3 ${isDark ? 'bg-slate-900' : 'bg-white'} p-3 rounded-md border ${borderColor} flex gap-2 items-start`}>
                          <Info size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{det.comment}</p>
                        </div>
                      )}

                      {mediaArray && mediaArray.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {mediaArray.map((img, i) => (
                            <div key={i} className="relative group cursor-zoom-in" onClick={() => onExpandImage(img.url || img)}>
                              <img src={typeof img === 'string' ? img : img.url} className={`w-20 h-20 object-cover rounded-md border ${borderColor} hover:opacity-80 transition-opacity`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormInput({ label, isDark, ...props }) { 
  return (
    <div className="space-y-1 text-left">
      <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
      <input className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} {...props} />
    </div>
  ); 
}

function FormSelect({ label, children, isDark, ...props }) { 
  return (
    <div className="space-y-1 text-left">
      <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
      <select className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} {...props}>{children}</select>
    </div>
  ); 
}

function LoginView({ onLogin, isDark }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className={`h-screen w-full flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`z-10 p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl text-center border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="inline-flex w-14 h-14 bg-blue-600 rounded-xl items-center justify-center font-bold text-2xl text-white mb-6">VQ</div>
        <h1 className="text-2xl font-bold mb-2 text-center">Acesso ao Portal</h1>
        <p className={`text-sm mb-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Entre com suas credenciais corporativas.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-4">
          <input required type="email" className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}`} placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}`} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full py-3 text-base" isDark={isDark}>Acessar Plataforma</Button>
        </form>
      </div>
    </div>
  );
}
