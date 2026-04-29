import { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle2, AlertCircle, Plus, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import TicketStatusBadge from '../components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../components/tickets/TicketPriorityBadge';
import useFetch from '../hooks/useFetch';
import { ENDPOINTS } from '../api/endpoints';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../constants/app';

const STATUS_FILTERS = ['All', ...TICKET_STATUSES];
const PRIORITY_FILTERS = ['All', ...TICKET_PRIORITIES];

export default function EmployeeDashboard() {
  const { data: allData } = useFetch(ENDPOINTS.TICKETS.BASE);

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const buildFilterUrl = () => {
    const q = new URLSearchParams();
    if (statusFilter !== 'All') q.set('status', statusFilter);
    if (priorityFilter !== 'All') q.set('priority', priorityFilter);
    if (debouncedSearch) q.set('search', debouncedSearch);
    const qs = q.toString();
    return qs ? `${ENDPOINTS.TICKETS.BASE}?${qs}` : ENDPOINTS.TICKETS.BASE;
  };

  const { data: filteredData, loading } = useFetch(buildFilterUrl());

  const allTickets = allData?.tickets || [];
  const stats = [
    { title: 'Total Tickets', value: allData?.pagination?.total || 0, icon: Ticket, color: 'purple' },
    { title: 'In Progress', value: allTickets.filter(t => t.status === 'In Progress').length, icon: Clock, color: 'blue' },
    { title: 'Resolved', value: allTickets.filter(t => t.status === 'Resolved').length, icon: CheckCircle2, color: 'green' },
    { title: 'Overdue', value: allTickets.filter(t => t.slaBreached && !['Resolved', 'Closed'].includes(t.status)).length, icon: AlertCircle, color: 'red' },
  ];

  const displayedTickets = filteredData?.tickets || [];
  const hasActiveFilters = statusFilter !== 'All' || priorityFilter !== 'All' || search;

  const clearFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setSearch('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Dashboard</h1>
          <p className="text-white/50">Manage and track your support requests</p>
        </div>
        <Link to="/tickets/create" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          Create New Ticket
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Ticket Table with Filter Bar */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">My Tickets</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-2 text-white/30" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white/60 focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer capitalize"
            >
              {PRIORITY_FILTERS.map((p) => (
                <option key={p} value={p} className="bg-black capitalize">
                  {p === 'All' ? 'All Priorities' : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-12 bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : displayedTickets.length > 0 ? (
                displayedTickets.map((ticket) => (
                  <tr key={ticket._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-brand-primary">{ticket.ticketId}</td>
                    <td className="px-6 py-4 text-white font-medium">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="p-2 glass rounded-lg inline-flex items-center justify-center text-white/50 hover:text-brand-primary hover:border-brand-primary/30 transition-all text-sm"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30 font-medium">
                    {hasActiveFilters
                      ? 'No tickets match your filters.'
                      : 'No tickets found. Create your first request!'}
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
