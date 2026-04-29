import { useState } from 'react';
import { LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { DASHBOARD_BY_ROLE } from '../../constants/app';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const basePath = user?.role === 'Admin' ? '/admin/tickets' : DASHBOARD_BY_ROLE[user?.role] || '/dashboard';
    navigate(`${basePath}?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
  };

  return (
    <nav className="h-16 border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">SupportDesk</span>
        </div>

        <form onSubmit={handleSearch} className="max-w-md w-full relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-white/30" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-white/40 uppercase tracking-tighter">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-brand-primary font-bold">
            {user?.name?.[0]}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-white/50 hover:text-destructive transition-colors ml-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
