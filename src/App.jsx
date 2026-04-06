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

// Constante de Meta Ajustada para 100%
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

// --- COMPONENTES DE UI BÁSICOS ---

const Button = ({ children, variant = 'primary', className = '', isDark = true, ...props }) => {
  const base = "px-6 py-2 rounded font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20",
    secondary: isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800",
    outline: isDark ? "bg-transparent border border-gray-500 text-white hover:bg-white/10" : "bg-transparent border border-gray-300 text-gray-800 hover:bg-black/5",
    ghost: isDark ? "bg-transparent text-gray-400 hover:text-white" : "bg-transparent text-gray-500 hover:text-black",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", isDark = true }) => (
  <div className={`${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'} rounded-lg overflow-hidden border transition-all duration-300 shadow-xl ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = 'neutral' }) => {
  const types = {
    success: "bg-green-500/20 text-green-500 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-500 border border-red-500/30",
    neutral: "bg-gray-500/20 text-gray-500 border border-gray-500/30",
    primary: "bg-blue-500/20 text-blue-500 border border-blue-500/30"
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${types[type]}`}>{children}</span>;
};

// --- COMPONENTES DA SIDEBAR ---

function NavItem({ icon, label, active, onClick, collapsed, isDark = true }) {
  return (
    <div className="relative group flex justify-center">
      <button
        onClick={onClick}
        className={`
          flex items-center transition-all duration-300 rounded-xl
          ${collapsed 
            ? 'w-10 h-10 justify-center' 
            : 'w-full p-4 gap-4'}
          ${active 
            ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30 scale-105' 
            : `${isDark ? 'text-gray-500 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-black/5 hover:text-black'}`}
        `}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && (
          <span className="text-sm font-bold uppercase tracking-tight italic truncate transition-all duration-300">
            {label}
          </span>
        )}
      </button>
      
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl">
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
          {label}
        </div>
      )}
    </div>
  );
}

// --- GRÁFICO PERFORMANCE MELHORADO ---

function PerformanceBarChart({ data, isDark }) {
  const maxScore = 100;
  const target = META_GLOBAL;
  
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-10">
      <div 
        className="relative h-64 flex items-end justify-start px-2 pt-10" 
        style={{ minWidth: `${Math.max(data.length * 60, 600)}px` }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map(val => (
            <div key={val} className="w-full flex items-center gap-2">
              <span className="text-[9px] font-black text-gray-500 w-6">{val}%</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>
            </div>
          ))}
        </div>

        {/* Meta Line */}
        <div 
          className="absolute left-8 right-0 border-t-2 border-dashed border-emerald-500/40 z-10 flex items-center"
          style={{ bottom: `${target}%` }}
        >
          <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 font-black rounded-r-md -ml-8">META {target}%</span>
        </div>

        {/* Bars */}
        <div className="relative flex-1 flex items-end justify-around gap-2 ml-8 h-full">
          {data.map((item, idx) => {
            const isSuccess = item.score >= target;
            const barHeight = (item.score / maxScore) * 100;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end" style={{ maxWidth: '40px' }}>
                {/* Tooltip */}
                <div className={`absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 pointer-events-none`}>
                  <div className={`${isSuccess ? 'bg-blue-600' : 'bg-red-600'} text-white text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap mb-2 relative`}>
                    {item.score.toFixed(1)}%
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${isSuccess ? 'bg-blue-600' : 'bg-red-600'} rotate-45`}></div>
                  </div>
                </div>

                {/* Bar Container */}
                <div className={`w-full rounded-t-lg relative transition-all duration-700 ${isDark ? 'bg-white/5' : 'bg-gray-100'} h-full flex flex-col justify-end`}>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-1000 ease-out shadow-lg ${isSuccess ? 'bg-gradient-to-t from-blue-700 to-blue-400' : 'bg-gradient-to-t from-red-700 to-red-400'}`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                {/* Label */}
                <div className="absolute top-[105%] rotate-45 origin-top-left whitespace-nowrap">
                  <span className={`text-[9px] font-black uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
        // Busca versão leve para estatísticas do dashboard, evitamos baixar as imagens globais
        supabaseClient.from('evaluation_details').select('id, evaluation_id, question_id, answer, cp_validated').limit(15000)
      ]);

      // Correção: Usando '==' para evitar problemas de tipo entre String/Int no mapeamento.
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
    // Busca os detalhes COMPLETOS desta avaliação sob demanda (Lazy Load)
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
      setSelectedEval(ev); // Fallback
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
       } else alert("Dados incorretos.");
    });
  };

  const logout = () => {
    localStorage.removeItem('vq_user');
    window.location.reload();
  };

  if (loading || !supabaseClient) return (
    <div className={`h-screen w-full ${isDark ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center justify-center text-center transition-colors duration-500`}>
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-black uppercase text-gray-500 tracking-widest animate-pulse">Sincronizando Portal VQ</p>
    </div>
  );

  if (!user) return <LoginView onLogin={handleLogin} isDark={isDark} />;

  const isAdmin = user.role === 'admin';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-[#f8f9fa] text-gray-900'} flex overflow-hidden transition-colors duration-300`}>
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isDark ? 'bg-black border-white/5' : 'bg-white border-gray-200'} border-r ${isSidebarOpen ? 'w-64' : 'w-20'} hidden lg:block no-print shadow-2xl`}>
        <div className={`p-6 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-black text-white italic text-xl shadow-lg shadow-blue-600/30 shrink-0">VQ</div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-blue-500 uppercase tracking-widest animate-in fade-in duration-500">Portal VQ</span>}
        </div>

        <nav className="mt-8 px-4 space-y-3">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<BarChart3 size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<History size={20}/>} label="histórico" active={activeTab === 'histórico'} onClick={() => setActiveTab('histórico')} collapsed={!isSidebarOpen} isDark={isDark} />
          
          {isAdmin && (
            <>
              {isSidebarOpen ? (
                <div className={`text-[10px] font-black uppercase tracking-widest mt-10 mb-2 px-3 animate-in fade-in duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Gestão de Rede</div>
              ) : (
                <div className={`h-px my-8 mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />
              )}
              <NavItem icon={<PlusCircle size={20}/>} label="Nova Auditoria" active={activeTab === 'new'} onClick={() => setActiveTab('new')} collapsed={!isSidebarOpen} isDark={isDark} />
              <NavItem icon={<Settings size={20}/>} label="Configuração - ADM" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} isDark={isDark} />
            </>
          )}
        </nav>

        <div className={`absolute bottom-8 left-0 w-full px-4 flex ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
           <NavItem icon={<LogOut size={20} />} label="Sair" active={false} onClick={logout} collapsed={!isSidebarOpen} isDark={isDark} />
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} h-screen overflow-y-auto no-scrollbar`}>
        <header className={`sticky top-0 z-40 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl px-8 py-5 flex items-center justify-between border-b ${isDark ? 'border-white/5' : 'border-gray-200'} no-print transition-colors`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-full transition-colors hidden lg:block ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800'}`}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black uppercase italic tracking-tighter capitalize">
              {activeTab === 'settings' ? 'Configuração - ADM' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-gray-200 text-gray-800 hover:bg-black/10'}`}
              title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {isDark ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-black uppercase leading-none">{user.name}</p>
              <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center font-black text-white text-lg border border-white/10 shadow-lg">{user.name.charAt(0)}</div>
          </div>
        </header>

        <div id="content-container" className="px-8 py-10 max-w-[1400px] mx-auto no-print">
          {activeTab === 'home' && <HomeView db={db} user={user} setActiveTab={setActiveTab} onShowReport={handleShowReport} isDark={isDark} />}
          {activeTab === 'dashboard' && <DashboardView db={db} user={user} isDark={isDark} />}
          {activeTab === 'histórico' && <HistoryView db={db} user={user} onShowReport={handleShowReport} isDark={isDark} />}
          {activeTab === 'new' && isAdmin && <NewAuditView db={db} supabaseClient={supabaseClient} onComplete={() => { fetchData(); setActiveTab('histórico'); }} isDark={isDark} />}
          {activeTab === 'settings' && isAdmin && <ManagementView db={db} supabaseClient={supabaseClient} fetchData={fetchData} isDark={isDark} />}
        </div>
      </main>

      {selectedEval && (
        <div id="report-portal" className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 no-print">
          <div className={`${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-200'} w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 text-left`}>
            <div className={`sticky top-0 z-50 ${isDark ? 'bg-[#121212]/95 border-white/10' : 'bg-white/95 border-gray-200'} px-8 py-6 border-b flex justify-between items-center text-left transition-colors`}>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white italic">VQ</div>
                <h3 className={`font-black uppercase italic ${isDark ? 'text-white' : 'text-gray-900'}`}>Dossiê Detalhado</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()} className="py-2 text-xs uppercase" isDark={isDark}><Printer size={16}/> Imprimir</Button>
                <button onClick={() => setSelectedEval(null)} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800'}`}><X/></button>
              </div>
            </div>
            <ReportContent evaluation={selectedEval} db={db} isDark={isDark} onExpandImage={setExpandedImg} />
          </div>
        </div>
      )}

      {expandedImg && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setExpandedImg(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img 
            src={expandedImg} 
            alt="Evidência Expandida" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" 
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

function ManagementView({ db, supabaseClient, fetchData, isDark }) {
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterChannelId, setFilterChannelId] = useState('all');

  const config = {
    users: { title: "Utilizadores", icon: <Users size={18}/>, table: "users" },
    managers: { title: "Gestoras", icon: <UserCheck size={18}/>, table: "managers" },
    stores: { title: "Lojas", icon: <Store size={18}/>, table: "stores" },
    channels: { title: "Canais", icon: <BarChart3 size={18}/>, table: "channels" },
    indicators: { title: "Indicadores", icon: <Layers size={18}/>, table: "indicators" },
    questions: { title: "Perguntas", icon: <FileText size={18}/>, table: "questions" }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmar eliminação?")) return;
    const { error } = await supabaseClient.from(config[activeSubTab].table).delete().eq('id', id);
    if (error) alert("Erro: " + error.message);
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
    if (error) alert("Erro ao guardar: " + error.message);
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
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter"></h1>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} font-bold uppercase tracking-widest text-[10px] mt-2`}>Configuração Geral do Sistema</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="py-3 uppercase text-xs tracking-widest" isDark={isDark}><Plus size={18}/> Novo Registo</Button>
      </div>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-1">
          {Object.entries(config).map(([key, val]) => (
            <button key={key} onClick={() => setActiveSubTab(key)} className={`flex items-center gap-2 px-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeSubTab === key ? 'border-blue-600 text-blue-500' : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}`}>{val.icon} {val.title}</button>
          ))}
        </div>
        {['stores', 'indicators', 'questions'].includes(activeSubTab) && (
          <div className="flex items-center gap-3 pb-2 md:pb-0">
            <Filter size={14} className="text-gray-500" />
            <select className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-blue-500 outline-none cursor-pointer`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}>
              <option value="all">Todos os Canais</option>
              {db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>
      <Card isDark={isDark} className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} text-[10px] font-black uppercase tracking-widest text-left`}>
            <tr><th className="p-4">Informação</th><th className="p-4">Associação</th><th className="p-4 text-right">Ações</th></tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
            {filteredData.map(item => (
              <tr key={item.id} className={`${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'} transition-colors group`}>
                <td className="p-4">
                  <p className={`font-black uppercase italic ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.name || item.text}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{item.email || item.code || `ID: #${item.id}`}</p>
                </td>
                <td className="p-4">
                  {activeSubTab === 'users' && <Badge type={item.role === 'admin' ? 'primary' : 'neutral'}>{item.role}</Badge>}
                  {activeSubTab === 'managers' && <Badge type={item.status === 'Ativa' ? 'success' : 'warning'}>{item.status}</Badge>}
                  {activeSubTab === 'stores' && <span className="text-xs text-gray-400 font-bold uppercase">{db.channels.find(c => c.id == item.channelId)?.name}</span>}
                  {activeSubTab === 'questions' && <Badge type={item.severity === 'gravissima' ? 'danger' : 'neutral'}>{item.severity}</Badge>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEdit(item)} className={`p-2 ${isDark ? 'bg-white/5 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600'} rounded-lg transition-colors`}><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(item.id)} className={`p-2 ${isDark ? 'bg-white/5 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-600'} rounded-lg transition-colors`}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <Card isDark={isDark} className="w-full max-w-lg p-8 space-y-6">
            <h3 className={`font-black uppercase italic text-xl border-b pb-4 text-left ${isDark ? 'text-white border-white/5' : 'text-gray-900 border-gray-100'}`}>{editingItem ? 'Editar' : 'Novo'} {config[activeSubTab].title}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 text-left">
              {activeSubTab === 'users' && (<UserForm editingItem={editingItem} db={db} isDark={isDark} />)}
              {activeSubTab === 'managers' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Status" name="status" isDark={isDark} defaultValue={editingItem?.status}><option value="Ativa">Ativa</option><option value="Férias">Férias</option><option value="Desligada">Desligada</option></FormSelect></>)}
              {activeSubTab === 'stores' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormInput label="Código" name="code" isDark={isDark} defaultValue={editingItem?.code} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect><FormSelect label="Gestora" name="managerId" isDark={isDark} defaultValue={editingItem?.managerId}><option value="">Selecione...</option>{db.managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'channels' && <FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required />}
              {activeSubTab === 'indicators' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'questions' && (<><FormInput label="Texto" name="text" isDark={isDark} defaultValue={editingItem?.text} required /><FormSelect label="Gravidade" name="severity" isDark={isDark} defaultValue={editingItem?.severity}><option value="leve">Leve</option><option value="media">Média</option><option value="grave">Grave</option><option value="gravissima">Gravíssima</option></FormSelect><FormSelect label="Indicador" name="indicatorId" isDark={isDark} defaultValue={editingItem?.indicatorId}>{db.indicators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</FormSelect></>)}
              <div className="pt-4 flex gap-4"><Button type="submit" className="flex-1" isDark={isDark}>Guardar</Button><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} isDark={isDark}>Cancelar</Button></div>
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
      <FormInput label="Senha" name="password" isDark={isDark} defaultValue={editingItem?.password || '123'} required />
      <FormSelect label="Função" name="role" isDark={isDark} value={role} onChange={e => setRole(e.target.value)}><option value="admin">Administrador</option><option value="manager">Gestora</option><option value="supervisor">Supervisora</option></FormSelect>
      {role === 'manager' && (<FormSelect label="Unidade Vinculada (Obrigatório)" isDark={isDark} name="storeId" defaultValue={editingItem?.storeId} required><option value="">Selecione a loja...</option>{db.stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>)}
      {role === 'supervisor' && (<div className="space-y-2"><label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Lojas Acessíveis (IDs)</label><input className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white placeholder-gray-700' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300'} border rounded-xl p-4 text-sm outline-none focus:border-blue-600 transition-all`} name="accessibleStores" placeholder="Ex: 1, 4, 12" defaultValue={editingItem?.accessibleStores?.join(', ')} /></div>)}
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
    <div className="space-y-10 animate-in fade-in duration-500 text-left">
      <Card isDark={isDark} className="p-6 bg-transparent no-print text-left">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="space-y-2 flex-1 min-w-[200px] text-left"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-left"><Filter size={12}/> Canal</label><select className={`w-full ${isDark ? 'bg-[#1c1c1c] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none transition-colors`} value={filterChannel} onChange={e => setFilterChannel(e.target.value)}><option value="all">Todos</option>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="space-y-2 flex-1 min-w-[200px] text-left"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-left"><Calendar size={12}/> Mês</label><input type="month" className={`w-full ${isDark ? 'bg-[#1c1c1c] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none transition-colors`} value={filterMonth} onChange={e => setFilterMonth(e.target.value)} /></div>
          <Button variant="outline" onClick={() => { setFilterChannel('all'); setFilterMonth(""); }} className="mb-1 uppercase text-xs" isDark={isDark}>Limpar</Button>
        </div>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard isDark={isDark} title="AUDITORIAS" value={stats.audits} icon={<ClipboardCheck className="text-blue-500"/>} subtitle="REALIZADO" />
        <StatCard isDark={isDark} title="LOJAS" value={stats.stores} icon={<Store className="text-purple-500"/>} subtitle="VISITADAS" />
        <StatCard isDark={isDark} title="CONFORMIDADE" value={`${stats.conf}%`} icon={<TrendingUp className="text-green-500"/>} subtitle="MÉDIA ACERTO" />
        <StatCard isDark={isDark} title="INCONFORME" value={`${stats.inconf}%`} icon={<TrendingDown className="text-red-500"/>} subtitle="MÉDIA FALHA" />
      </section>

      {/* GRÁFICO REALIZADO X META - POSICIONADO ACIMA */}
      <Card isDark={isDark} className="p-8 space-y-8 relative min-h-[450px] text-left w-full">
        <div className="flex justify-between items-center">
          <h3 className={`text-xl font-black uppercase italic flex items-center gap-3 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Target className="text-emerald-500"/> Realizado X meta
          </h3>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-600"></div> <span>Meta 100%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-600"></div> <span>Abaixo</span></div>
          </div>
        </div>
        
        {/* Exibe todas as lojas sem .slice() e com scroll horizontal */}
        <PerformanceBarChart 
          data={rankings.storeRank} 
          isDark={isDark} 
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <Card isDark={isDark} className="p-8 space-y-6 text-left">
          <h3 className={`text-xl font-black uppercase italic flex items-center gap-3 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}><PlayCircle className="text-blue-500"/> Volume de Visitas</h3>
          {/* Scroll oculto para Volume de Visitas */}
          <div className="space-y-4 text-left max-h-[400px] overflow-y-auto no-scrollbar pr-2">
            {rankings.storeRank.map(store => (
              <div key={store.id} className="space-y-1 text-left">
                <div className="flex justify-between text-[11px] font-bold uppercase">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{store.name}</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{store.visits} visitas</span>
                </div>
                <div className={`h-2 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${(store.visits / Math.max(1, ...rankings.storeRank.map(s => s.visits))) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="space-y-8">
           <Card isDark={isDark} className="p-0 text-left">
            <div className={`p-6 border-b ${isDark ? 'border-white/5 bg-blue-600/5' : 'border-gray-100 bg-blue-50/50'}`}><h4 className="font-black uppercase italic text-sm text-blue-500 flex items-center gap-2"><Store size={16}/> Ranking por Loja</h4></div>
            {/* Scroll oculto para Ranking Loja */}
            <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
              {rankings.storeRank.length > 0 ? rankings.storeRank.map((s, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-800'} text-left transition-colors`}>
                  <div className="flex items-center gap-3 text-left">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i < 3 ? 'bg-blue-500 text-white' : `${isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-500'}`}`}>#{i+1}</span>
                    <span className="text-xs font-bold uppercase truncate max-w-[120px]">{s.name}</span>
                  </div>
                  <span className="text-xs font-black text-blue-500">{s.score.toFixed(2)}%</span>
                </div>
              )) : <div className="p-10 text-center text-gray-600 text-xs font-bold tracking-widest uppercase">Sem dados</div>}
            </div>
          </Card>

          <Card isDark={isDark} className="p-0 text-left">
            <div className={`p-6 border-b ${isDark ? 'border-white/5 bg-yellow-500/5' : 'border-gray-100 bg-yellow-50/50'}`}><h4 className="font-black uppercase italic text-sm text-yellow-500 flex items-center gap-2"><UserCheck size={16}/> Ranking por Gestora</h4></div>
            {/* Scroll oculto para Ranking Gestora */}
            <div className="p-4 space-y-2 text-left max-h-[250px] overflow-y-auto no-scrollbar">
              {rankings.managerRank.length > 0 ? rankings.managerRank.map((m, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-800'} text-left transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i < 3 ? 'bg-yellow-500 text-black' : `${isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-500'}`}`}>#{i+1}</span>
                    <span className="text-xs font-bold uppercase truncate max-w-[120px]">{m.name}</span>
                  </div>
                  <span className={`text-xs font-black ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{m.score.toFixed(2)}%</span>
                </div>
              )) : <div className="p-10 text-center text-gray-600 text-xs font-bold tracking-widest uppercase">Sem dados</div>}
            </div>
          </Card>
        </div>
      </div>

      <Card isDark={isDark} className="p-0 overflow-hidden text-left border-white/5">
        <div className={`p-6 border-b ${isDark ? 'border-white/5 bg-red-600/5' : 'border-gray-100 bg-red-50/50'} flex justify-between items-center`}><h4 className="font-black uppercase italic text-sm text-red-500 flex items-center gap-2"><AlertTriangle size={16}/> Top 5 Falhas Recorrentes</h4></div>
        <table className="w-full text-left">
          <thead className={isDark ? 'bg-white/5' : 'bg-gray-50'}>
            <tr className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              <th className="p-4">Item de Verificação</th><th className="p-4 text-right">Ocorrências</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
            {topProblems.map((p, i) => (
              <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50/50'}`}>
                <td className={`p-4 text-[11px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{p.text}</td>
                <td className="p-4 text-right"><span className="bg-red-500/10 text-red-500 px-4 py-1 rounded-full text-[10px] font-black">{p.count}</span></td>
              </tr>
            ))}
            {topProblems.length === 0 && <tr><td colSpan="2" className="p-20 text-center text-gray-600 font-bold uppercase italic tracking-widest">Sem registos</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function HomeView({ db, user, setActiveTab, onShowReport, isDark }) {
  const auditList = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.evaluations, user]);
  
  const avg = auditList.length ? (auditList.reduce((a, b) => a + b.score, 0) / auditList.length).toFixed(2) : "0.00";
  const criticalCount = auditList.filter(e => e.score < 75).length;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 text-left">
      <section className={`relative h-[380px] rounded-3xl overflow-hidden group shadow-2xl border ${isDark ? 'border-white/5' : 'border-gray-200'} text-left`}>
        <img src="/img/loja.jpg" className="w-full h-full object-cover opacity-50 transition-all duration-[3000ms] group-hover:scale-105" />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80' : 'bg-gradient-to-r from-white via-white/80'} to-transparent flex flex-col justify-center p-16 text-left transition-colors`}>
          <h1 className={`text-6xl font-black mb-4 uppercase italic leading-[0.9] text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>Visita de Qualidade <br/> </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-xl text-base mb-8 font-medium text-left`}>Acompanhamento de Auditoria em tempo real</p>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setActiveTab('dashboard')} className="px-8 py-3 uppercase text-xs tracking-widest" isDark={isDark}><BarChart3 size={18}/> Dashboard</Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard isDark={isDark} title="PERFORMANCE REDE" value={`${avg}%`} icon={<BarChart3 className="text-blue-500" size={24}/>} subtitle="MÉDIA DE AUDITORIAS" />
        <StatCard isDark={isDark} title="ALERTAS CRÍTICOS" value={criticalCount} icon={<AlertCircle className="text-red-500" size={24}/>} subtitle="ABAIXO DO ALVO" />
        <StatCard isDark={isDark} title="PORTFOLIO LOJAS" value={db.stores.length} icon={<Store className="text-green-500" size={24}/>} subtitle="UNIDADES MONITORIZADAS" />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className={`lg:col-span-8 ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-100'} rounded-3xl p-8 border shadow-2xl flex flex-col text-left transition-colors`}>
          <div className="flex items-center gap-3 mb-10 text-left">
            <Clock size={24} className="text-red-500"/>
            <h3 className={`text-2xl font-black italic uppercase tracking-tighter text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>Atividades Recentes</h3>
          </div>
          <div className="space-y-4 flex-1 text-left">
            {auditList.slice(0, 4).map((ev, idx) => { 
              const store = db.stores.find(s => s.id === ev.storeId); 
              return (
                <div key={ev.id} className={`${isDark ? 'bg-[#1c1c1c] border-white/5 hover:bg-[#252525]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'} rounded-2xl p-5 flex items-center gap-5 transition-all border group cursor-pointer text-left`} onClick={() => onShowReport(ev)}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg ${idx === 0 ? 'bg-blue-600/10 text-blue-500' : 'bg-red-600/10 text-red-500'}`}>{idx === 0 ? <CheckCircle size={24} /> : <PlayCircle size={24} />}</div>
                  <div className="flex-1 text-left">
                    <p className={`text-base font-medium text-left ${isDark ? 'text-gray-300' : 'text-gray-600'}`}><span className={`${isDark ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-tighter`}>{ev.evaluator}</span> concluiu a auditoria na unidade <span className="text-red-500 font-black italic uppercase tracking-tighter">{store?.name}</span></p>
                    <p className={`text-[10px] font-black uppercase mt-1 tracking-[0.2em] text-left ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Auditado em {new Date(ev.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg text-gray-500 transition-opacity"><Printer size={18}/></button>
                </div>
              ); 
            })}
          </div>
        </div>
        <div className="lg:col-span-4 h-full"><div className="bg-red-600 rounded-3xl p-10 h-full min-h-[420px] flex flex-col justify-between shadow-[0_20px_50px_rgba(220,38,38,0.4)] relative overflow-hidden group"><div className="relative z-10 text-left"><h4 className="text-4xl font-black italic leading-[0.85] uppercase tracking-tighter text-white">Média de <br/> Aprovações</h4><div className="mt-12"><span className="text-9xl font-black italic tracking-tighter leading-none text-white">{avg}%</span></div></div><div className="relative z-10 text-left"><p className="text-sm font-bold text-white leading-snug opacity-90">O score reflete o cumprimento total dos padrões VQ na última auditoria técnica.</p></div><div className="absolute bottom-0 right-0 p-8 flex items-end gap-1.5 opacity-20 group-hover:opacity-40 transition-all translate-y-4"><div className="w-3 h-10 bg-white rounded-t-lg"></div><div className="w-3 h-20 bg-white rounded-t-lg"></div><div className="w-3 h-14 bg-white rounded-t-lg"></div><div className="w-3 h-28 bg-white rounded-t-lg"></div><div className="w-3 h-18 bg-white rounded-t-lg"></div></div></div></div>
      </section>
    </div>
  );
}

function HistoryView({ db, user, onShowReport, isDark }) {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <Card isDark={isDark} className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border-white/10`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2"><UserCheck size={12}/> Gestora</label><input className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none focus:border-blue-600`} placeholder="Buscar por gestora..." value={searchGestor} onChange={e => setSearchGestor(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2"><Store size={12}/> Loja / Código</label><input className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none focus:border-blue-600`} placeholder="Nome ou código..." value={searchLoja} onChange={e => setSearchLoja(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2"><Tag size={12}/> Canal</label><select className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none focus:border-blue-600`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}><option value="all">Todos os Canais</option>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2"><Target size={12}/> Atingimento</label><select className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-3 text-sm outline-none focus:border-blue-600`} value={filterRange} onChange={e => setFilterRange(e.target.value)}><option value="all">Todas as Faixas</option><option value="95-100">95% — 100%</option><option value="90-94">90% — 94%</option><option value="80-89">80% — 89%</option><option value="abaixo-79">Abaixo de 80%</option></select></div>
        </div>
      </Card>
      <Card isDark={isDark}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} text-gray-500 text-[10px] font-black uppercase tracking-widest`}>
              <tr><th className="p-6">Data</th><th className="p-6">Loja</th><th className="p-6">Canal</th><th className="p-6">Score</th><th className="p-6 text-right">Ações</th></tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
              {evals.map(ev => { 
                const store = db.stores.find(s => s.id == ev.storeId); 
                const channel = db.channels.find(c => c.id == ev.channelId); 
                return (
                  <tr key={ev.id} className={`${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50/50'} group cursor-pointer transition-colors`} onClick={() => onShowReport(ev)}>
                    <td className="p-6 font-bold text-gray-400">{new Date(ev.date).toLocaleDateString()}</td>
                    <td className="p-6">
                      <p className={`font-black uppercase italic tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>{store?.name}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase">{store?.code}</p>
                    </td>
                    <td className="p-6 text-gray-500 uppercase text-xs font-bold">{channel?.name}</td>
                    <td className="p-6"><Badge type={ev.score >= 80 ? 'success' : 'danger'}>{Number(ev.score).toFixed(2)}%</Badge></td>
                    <td className="p-6 text-right no-print"><button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg text-gray-500 transition-opacity"><Printer size={18}/></button></td>
                  </tr>
                ); 
              })}
              {evals.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-gray-600 font-bold uppercase italic tracking-widest">Sem registos</td></tr>}
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
    if (!config.storeId) return alert("Selecione uma loja.");
    const store = db.stores.find(s => s.id == config.storeId);
    const inds = db.indicators.filter(i => i.channelId == store.channelId);
    if (!inds.length) return alert("Sem indicadores.");
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
        // Redimensiona a imagem para evitar estouro de Payload no banco
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
        
        // Comprime para JPG reduzindo a qualidade e o peso
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
      alert("Erro ao criar a avaliação principal: " + evalError.message);
      setSubmitting(false);
      return;
    }

    if (newEval) {
      const details = Object.keys(answers).map(qId => ({ evaluation_id: newEval.id, question_id: qId, answer: answers[qId].value, comment: answers[qId].comment || "", cp_validated: answers[qId].cp || false, media: answers[qId].media || [] }));
      
      if (details.length > 0) {
        const { error: detError } = await supabaseClient.from('evaluation_details').insert(details);
        if (detError) {
          alert("Alerta: A auditoria foi salva, mas ocorreu um erro ao salvar as respostas ou imagens (podem estar muito pesadas). Erro: " + detError.message);
        }
      }
      onComplete();
    }
    setSubmitting(false);
  };

  if (step === 1) return (
    <div className="max-w-2xl mx-auto space-y-12 pt-20 animate-in slide-in-from-bottom-8 duration-500 text-left">
      <div className="text-center"><h1 className="text-6xl font-black italic uppercase text-blue-500 tracking-tighter">Pagina do Avaliador</h1><p className="text-gray-500 font-bold uppercase tracking-[0.4em]"></p></div>
      <Card isDark={isDark} className="p-10 space-y-8 text-left">
        <div className="space-y-3 text-left">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Unidade</label>
          <select className={`w-full ${isDark ? 'bg-[#2a2a2a] border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-5 outline-none focus:ring-2 ring-blue-600 font-bold transition-all`} value={config.storeId} onChange={e => setConfig({...config, storeId: e.target.value})}>
            <option value="">Selecione Unidade...</option>
            {db.stores.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
          </select>
        </div>
        <Button onClick={startAudit} className="w-full py-6 text-xl uppercase italic shadow-2xl" isDark={isDark}>Iniciar Checklist</Button>
      </Card>
    </div>
  );

  const store = db.stores.find(s => s.id == config.storeId); 
  const inds = db.indicators.filter(i => i.channelId == store.channelId); 
  const currentInd = inds.find(i => i.id == activeInd); 
  const questions = db.questions.filter(q => q.indicatorId == activeInd);

  return (
    <div className="flex gap-10 relative pb-32 text-left">
      <div className="w-80 space-y-3 hidden xl:block sticky top-32 h-fit">
        {inds.map(ind => (
          <button key={ind.id} onClick={() => setActiveInd(ind.id)} className={`w-full p-5 rounded-xl border text-left transition-all ${activeInd === ind.id ? 'bg-blue-600 border-blue-500 shadow-lg text-white' : `${isDark ? 'bg-[#181818] border-white/5 text-gray-500 hover:bg-white/5' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}`}>
            <span className="font-black uppercase italic block">{ind.name}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-8">
        <div className={`flex justify-between items-center p-8 border rounded-2xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} transition-colors`}>
          <h2 className="text-4xl font-black italic uppercase text-blue-500">{currentInd?.name}</h2>
          <div className="text-right"><p className="text-5xl font-black italic">{calculateScore().toFixed(2)}%</p></div>
        </div>
        <div className="space-y-6">
          {questions.map(q => (
            <Card key={q.id} isDark={isDark} className="p-8 border-white/10">
              <div className="flex justify-between items-start gap-4 mb-8">
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{q.text}</p>
                <Badge type={q.severity === 'gravissima' ? 'danger' : 'neutral'}>{q.severity}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <AnswerBtn active={answers[q.id]?.value === 'conforme'} onClick={() => handleAnswer(q.id, 'conforme')} label="Conforme" variant="success" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'inconforme'} onClick={() => handleAnswer(q.id, 'inconforme')} label="Inconforme" variant="danger" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'na'} onClick={() => handleAnswer(q.id, 'na')} label="N/A" variant="neutral" isDark={isDark} />
              </div>
              {answers[q.id]?.value === 'inconforme' && (
                <div className={`mt-8 space-y-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} animate-in slide-in-from-top-2`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-yellow-500" checked={answers[q.id]?.cp} onChange={e => handleAnswer(q.id, 'inconforme', e.target.checked, answers[q.id]?.comment)}/>
                    <span className="font-bold text-yellow-500 uppercase text-xs">CP Validado</span>
                  </label>
                  <textarea placeholder="Observações..." className={`w-full ${isDark ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl p-4 text-sm outline-none transition-colors`} value={answers[q.id]?.comment} onChange={e => handleAnswer(q.id, 'inconforme', answers[q.id]?.cp, e.target.value)} />
                  <Button variant="outline" onClick={() => document.getElementById(`file-q-${q.id}`).click()} className="text-xs py-2" isDark={isDark}><Camera size={16}/> Anexar Foto</Button>
                  <input type="file" id={`file-q-${q.id}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(q.id, e)} />
                  <div className="flex gap-2 overflow-x-auto">{answers[q.id]?.media?.map((img, i) => <img key={i} src={img.url} className={`w-16 h-16 object-cover rounded-lg border ${isDark ? 'border-white/10' : 'border-gray-200'}`} />)}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="pt-10 flex justify-end">
          <Button disabled={submitting} onClick={submitAudit} className="px-14 py-6 bg-green-600 text-xl font-black italic uppercase text-white">Finalizar Inspeção</Button>
        </div>
      </div>
    </div>
  );
}

// --- AUXILIARES ADICIONAIS ---

function AnswerBtn({ active, label, onClick, variant, isDark }) {
  const styles = {
    success: active ? 'bg-green-600 text-white border-green-500 shadow-md' : `bg-transparent ${isDark ? 'border-white/10 text-gray-500 hover:border-green-600/50' : 'border-gray-200 text-gray-400 hover:border-green-600/50'}`,
    danger: active ? 'bg-red-600 text-white border-red-500 shadow-md' : `bg-transparent ${isDark ? 'border-white/10 text-gray-500 hover:border-green-600/50' : 'border-gray-200 text-gray-400 hover:border-green-600/50'}`,
    neutral: active ? 'bg-gray-600 text-white border-gray-600 shadow-md' : `bg-transparent ${isDark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`
  };
  return <button onClick={onClick} className={`px-5 py-4 rounded-xl text-[10px] font-black uppercase border transition-all ${styles[variant]}`}>{label}</button>;
}

function StatCard({ title, value, icon, subtitle, isDark }) { 
  return (
    <Card isDark={isDark} className="p-8 relative overflow-hidden group text-left">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-black border-white/5' : 'bg-gray-50 border-gray-100'} shadow-inner`}>{icon}</div>
        <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{title}</span>
      </div>
      <div className={`text-5xl font-black mb-2 italic tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{subtitle}</div>
    </Card>
  ); 
}

// --- VISUALIZAÇÃO DE DOSSIÊ MELHORADA E CORRIGIDA ---

function ReportContent({ evaluation, db, isDark = true, onExpandImage }) {
  const store = db.stores.find(s => s.id == evaluation.storeId);
  const manager = db.managers.find(m => m.id == store?.managerId);
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-white/5' : 'border-gray-200';
  const bgCard = isDark ? 'bg-white/5' : 'bg-white';

  // Agrupa os detalhes da avaliação por Indicador para uma visualização limpa
  const groupedDetails = {};
  evaluation.details?.forEach(det => {
    const q = db.questions.find(q => q.id == det.questionId);
    const indId = q ? q.indicatorId : 'unknown';
    if (!groupedDetails[indId]) {
      groupedDetails[indId] = [];
    }
    groupedDetails[indId].push({ det, q: q || { text: 'Pergunta não encontrada ou removida', severity: 'neutral' } });
  });

  return (
    <div className={`p-8 sm:p-12 space-y-10 ${textColor} text-left transition-colors`}>
      {/* Cabeçalho do Dossiê */}
      <div className={`grid grid-cols-2 gap-8 border-b ${borderColor} pb-8 text-left`}>
        <div className="space-y-4 text-left">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Unidade</p>
            <p className="text-xl font-black uppercase italic text-blue-500">{store?.name || 'Desconhecida'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Data da Auditoria</p>
            <p className="text-lg font-black">{new Date(evaluation.date).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="space-y-4 text-right">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Gestora Responsável</p>
            <p className="text-lg font-black">{manager?.name || 'Não atribuída'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Avaliador</p>
            <p className="text-lg font-black">{evaluation.evaluator}</p>
          </div>
        </div>
      </div>

      {/* Cartões de Pontuação */}
      <div className="grid grid-cols-3 gap-6">
        <div className={`${bgCard} p-6 rounded-2xl text-center border ${borderColor} shadow-sm`}>
          <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Score Final</p>
          <p className={`text-5xl font-black italic ${evaluation.score >= 80 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(evaluation.score).toFixed(2)}%
          </p>
        </div>
        <div className={`${bgCard} p-6 rounded-2xl text-center border ${borderColor} shadow-sm`}>
          <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Status</p>
          <p className="text-lg font-black uppercase mt-2">{evaluation.score >= 80 ? 'Aprovado' : 'Reprovado'}</p>
        </div>
        <div className={`${bgCard} p-6 rounded-2xl text-center border ${borderColor} shadow-sm`}>
          <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Deduções</p>
          <p className="text-lg font-black uppercase mt-2">{(100 - evaluation.score).toFixed(2)} pts</p>
        </div>
      </div>

      {/* Checklist Detalhado Agrupado */}
      <div className="space-y-8 text-left">
        <h4 className="text-xl font-black uppercase italic border-l-4 border-blue-600 pl-4 text-left">Checklist Detalhado</h4>
        
        {Object.keys(groupedDetails).length === 0 && (
          <p className="text-gray-500 italic">Nenhum detalhe foi encontrado para esta auditoria.</p>
        )}

        {Object.keys(groupedDetails).map(indId => {
          const indicator = db.indicators.find(i => i.id == indId);
          const indName = indicator ? indicator.name : 'Outros / Removidos';

          return (
            <div key={indId} className="space-y-4 mt-6">
              <h5 className={`text-lg font-black italic uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'} border-b ${borderColor} pb-2`}>
                {indName}
              </h5>

              <div className="space-y-4">
                {groupedDetails[indId].map(({det, q}) => {
                  
                  // Conversão Robusta de Mídia
                  let mediaArray = [];
                  try {
                    if (Array.isArray(det.media)) {
                      mediaArray = det.media;
                    } else if (typeof det.media === 'string') {
                      if (det.media.startsWith('[')) {
                        mediaArray = JSON.parse(det.media);
                      } else if (det.media.trim() !== '') {
                        mediaArray = [{ url: det.media }];
                      }
                    }
                  } catch (e) {
                    console.error("Erro ao parsear media", e);
                  }

                  return (
                    <div key={det.id} className={`${bgCard} border ${borderColor} rounded-xl p-6 break-inside-avoid shadow-sm`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <p className="font-bold text-lg leading-tight flex-1">{q.text}</p>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Verifica CP validado */}
                          {det.cpValidated && (
                            <Badge type="warning">CP Validado</Badge>
                          )}
                          <Badge type={det.answer === 'conforme' ? 'success' : det.answer === 'inconforme' ? 'danger' : 'neutral'}>
                            {det.answer === 'na' ? 'N/A' : det.answer}
                          </Badge>
                        </div>
                      </div>

                      {/* Caixa de Comentários Aprimorada */}
                      {det.comment && (
                        <div className={`mt-4 ${isDark ? 'bg-blue-600/10' : 'bg-blue-50'} p-4 rounded-xl border ${isDark ? 'border-blue-600/20' : 'border-blue-200'} flex gap-3 items-start`}>
                          <Info size={18} className="text-blue-500 shrink-0 mt-0.5"/>
                          <p className="text-sm italic font-medium leading-relaxed">"{det.comment}"</p>
                        </div>
                      )}

                      {/* Exibição de Mídias/Imagens */}
                      {mediaArray && mediaArray.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {mediaArray.map((img, i) => (
                            <div key={i} className="relative group/img cursor-zoom-in" onClick={() => onExpandImage(img.url || img)}>
                              <img src={typeof img === 'string' ? img : img.url} className={`w-28 h-28 object-cover rounded-lg border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-md hover:border-blue-500 transition-all`} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                <Maximize2 size={20} className="text-white" />
                              </div>
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
      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</label>
      <input className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white placeholder-gray-700' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300'} border rounded-xl p-4 text-sm outline-none focus:border-blue-600 transition-all`} {...props} />
    </div>
  ); 
}

function FormSelect({ label, children, isDark, ...props }) { 
  return (
    <div className="space-y-1 text-left">
      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</label>
      <select className={`w-full ${isDark ? 'bg-[#252525] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl p-4 text-sm outline-none focus:border-blue-600 transition-all cursor-pointer`} {...props}>{children}</select>
    </div>
  ); 
}

function LoginView({ onLogin, isDark }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className={`h-screen w-full flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-500`}>
      <div className="absolute inset-0 opacity-40 blur-sm scale-110"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" /></div>
      <div className={`z-10 ${isDark ? 'bg-black/85 border-white/10' : 'bg-white/85 border-gray-200'} p-12 rounded-3xl border backdrop-blur-2xl w-full max-w-md shadow-2xl text-center transition-colors`}>
        <div className="inline-flex w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center font-black text-4xl italic mb-6 rotate-3 shadow-2xl shadow-blue-600/30 text-white">VQ</div>
        <h1 className="text-4xl font-black mb-8 uppercase italic tracking-tighter text-center">Portal VQ</h1>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-6">
          <input required type="email" className={`w-full ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-xl p-5 text-left outline-none transition-all`} placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className={`w-full ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-xl p-5 text-left outline-none transition-all`} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full py-5 text-xl uppercase italic shadow-xl shadow-blue-600/10" isDark={isDark}>Entrar</Button>
        </form>
      </div>
    </div>
  );
}
