import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import TicketStatusBadge from '../components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../components/tickets/TicketPriorityBadge';
import useFetch from '../hooks/useFetch';
import { ENDPOINTS } from '../api/endpoints';
import { DEPARTMENTS, TICKET_PRIORITIES, TICKET_STATUSES } from '../constants/app';

export default function AdminTickets() {
  const location = useLocation();

  // Read any search from URL (from Navbar search)
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Debounce search input 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Build URL from active filters
  const buildUrl = () => {
    const q = new URLSearchParams();
    q.set('limit', '50');
    if (debouncedSearch) q.set('search', debouncedSearch);
    if (statusFilter) q.set('status', statusFilter);
    if (priorityFilter) q.set('priority', priorityFilter);
    if (categoryFilter) q.set('category', categoryFilter);
    return `${ENDPOINTS.TICKETS.BASE}?${q.toString()}`;
  };

  const { data, loading } = useFetch(buildUrl());

  const tickets = data?.tickets || [];

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  const hasFilters = search || statusFilter || priorityFilter || categoryFilter;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Tickets</h1>
          <p className="text-white/50">Monitor, filter, and manage every ticket in the system</p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or ticket ID..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white/70 focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-black">All Statuses</option>
          {TICKET_STATUSES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
        </select>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white/70 focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer capitalize"
        >
          <option value="" className="bg-black">All Priorities</option>
          {TICKET_PRIORITIES.map(p => <option key={p} value={p} className="bg-black capitalize">{p}</option>)}
        </select>

        {/* Category / Department */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white/70 focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-black">All Departments</option>
          {DEPARTMENTS.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter size={18} className="text-brand-primary" />
            Results
          </h2>
          <span className="text-sm text-white/40">{loading ? '...' : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}`}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Raised By</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-5 py-4">
                      <div className="h-10 bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white font-medium truncate max-w-[160px]">{ticket.subject}</p>
                        <p className="text-xs text-brand-primary font-mono">{ticket.ticketId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">{ticket.category}</td>
                    <td className="px-5 py-4"><TicketPriorityBadge priority={ticket.priority} /></td>
                    <td className="px-5 py-4"><TicketStatusBadge status={ticket.status} /></td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-white">{ticket.raisedBy?.name}</p>
                        <p className="text-xs text-white/40">{ticket.raisedBy?.department}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {ticket.assignedTo ? (
                        <p className="text-sm text-brand-primary font-medium">{ticket.assignedTo.name}</p>
                      ) : (
                        <span className="text-xs text-white/20 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-white/40">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="px-3 py-1.5 text-xs btn-primary inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-white/30">
                    No tickets match your filters.
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
