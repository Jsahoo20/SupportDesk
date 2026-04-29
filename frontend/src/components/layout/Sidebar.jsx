import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  Users
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const LINKS_BY_ROLE = {
  Employee: [
    { name: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'New Ticket', icon: PlusCircle, path: '/tickets/create' },
  ],
  Support: [
    { name: 'Queue', icon: LayoutDashboard, path: '/support' },
  ],
  Admin: [
    { name: 'Admin Hub', icon: LayoutDashboard, path: '/admin' },
    { name: 'All Tickets', icon: Ticket, path: '/admin/tickets' },
    { name: 'User Management', icon: Users, path: '/admin/panel' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = LINKS_BY_ROLE[user?.role] || [];

  const NavItem = ({ link }) => (
    <NavLink
      to={link.path}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
        ${isActive 
          ? 'bg-brand-primary/10 text-brand-primary shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' 
          : 'text-white/50 hover:bg-white/5 hover:text-white'}
      `}
    >
      <link.icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="font-medium">{link.name}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 border-r border-white/5 h-[calc(100vh-64px)] p-4 flex flex-col justify-between sticky top-16">
      <div className="space-y-6">
        <div className="px-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          <div className="space-y-1">
            {links.map(link => (
              <NavItem key={link.path} link={link} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
