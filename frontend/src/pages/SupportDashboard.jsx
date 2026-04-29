import { useState, useEffect } from 'react';
import { Ticket, Users, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import TicketStatusBadge from '../components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../components/tickets/TicketPriorityBadge';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import { ENDPOINTS } from '../api/endpoints';
import cn from '../utils/cn';

export default function SupportDashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search: wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Build the URL with search query if present
  const ticketUrl = debouncedSearch
    ? `${ENDPOINTS.TICKETS.BASE}?search=${encodeURIComponent(debouncedSearch)}`
    : ENDPOINTS.TICKETS.BASE;

  const { data, loading } = useFetch(ticketUrl);

  const activeTickets = data?.tickets?.filter(t => !['Resolved', 'Closed'].includes(t.status)) || [];

  const stats = [
    { title: 'Queue Size', value: activeTickets.length, icon: Users, color: 'blue' },
    { title: 'SLA At Risk', value: activeTickets.filter(t => t.slaBreached).length, icon: AlertTriangle, color: 'orange' },
    { title: 'My Resolved', value: data?.tickets?.filter(t => t.status === 'Resolved' && (t.assignedTo?._id === user?._id || t.assignedTo === user?._id)).length || 0, icon: CheckCircle2, color: 'green' },
    { title: 'My Active', value: activeTickets.filter(t => (t.assignedTo?._id === user?._id || t.assignedTo === user?._id)).length, icon: Ticket, color: 'purple' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Support Queue</h1>
          <p className="text-white/50">Manage assigned requests and resolve incoming issues</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-white/30 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket ID or subject..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="glass-card">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Incoming Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">SLA Deadline</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4"><div className="h-12 bg-white/5 rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : data?.tickets?.length > 0 ? (
                data.tickets.map((ticket) => (
                  <tr key={ticket._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium truncate max-w-[200px]">{ticket.subject}</span>
                        <span className="text-xs text-brand-primary font-mono">{ticket.ticketId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{ticket.raisedBy?.department}</td>
                    <td className="px-6 py-4">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className={cn(
                          "font-medium",
                          ticket.slaBreached ? 'text-red-500' : 'text-white/70'
                        )}>{new Date(ticket.slaDeadline).toLocaleTimeString()}</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-tighter">{new Date(ticket.slaDeadline).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="btn-primary py-1.5 px-4 text-xs"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30 font-medium">
                    Queue is empty. Great job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
