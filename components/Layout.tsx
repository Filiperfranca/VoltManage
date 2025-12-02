import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, Menu, Zap, Users, Wrench, Package, 
  ClipboardList, Search, Bell, ChevronDown, User as UserIcon
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPublicView = location.pathname.includes('/view/');

  if (isPublicView) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      
      {/* Sidebar Desktop - Clean White */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-slate-100 h-screen sticky top-0 z-30">
        <div className="p-6 flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Zap className="w-6 h-6 text-primary fill-primary" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">VoltManage</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3 mt-2">Principal</p>
          <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Overview" active={location.pathname === '/'} />
          <NavLink to="/os-list" icon={<ClipboardList size={18} />} label="Ordens de Serviço" active={location.pathname.includes('/os')} />
          
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3 mt-8">Gestão</p>
          <NavLink to="/clients" icon={<Users size={18} />} label="Clientes" active={location.pathname === '/clients'} />
          <NavLink to="/machines" icon={<Wrench size={18} />} label="Máquinas" active={location.pathname === '/machines'} />
          <NavLink to="/parts" icon={<Package size={18} />} label="Peças & Estoque" active={location.pathname === '/parts'} />
          
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3 mt-8">Sistema</p>
          <NavLink to="/settings" icon={<Settings size={18} />} label="Configurações" active={location.pathname === '/settings'} />
        </nav>

        {/* User Mini Profile in Sidebar Bottom */}
        <div className="p-4 mt-auto border-t border-slate-50">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-primary/20">
                    TC
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-700 truncate">Técnico Chefe</p>
                    <p className="text-xs text-slate-400 truncate">admin@volt.com</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-surface h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 md:hidden">
                <Menu className="text-slate-500" />
                <span className="font-bold text-lg">VoltManage</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-2 w-96 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
                <Search className="text-slate-400 w-4 h-4 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search or type a command..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400 text-slate-600"
                />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
      active 
        ? 'bg-primary/5 text-primary' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);