import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Users, Ticket, Award, Ban, LayoutPanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import useFetch from '../hooks/useFetch';
import { ENDPOINTS } from '../api/endpoints';
import api from '../api/axios';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { data: stats } = useFetch(ENDPOINTS.DASHBOARD.STATS);
  
  // Real status breakdown for pie chart
  const chartData = stats?.statusBreakdown?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  // Real department breakdown from API
  const deptData = stats?.deptBreakdown?.map(item => ({
    name: item._id,
    count: item.count,
  })) || [];

  const handleExport = async () => {
    try {
      const res = await api.get(ENDPOINTS.TICKETS.BASE, { params: { limit: 1000 } });
      const tickets = res.data.data.tickets;
      const headers = ['Ticket ID', 'Subject', 'Category', 'Priority', 'Status', 'Raised By', 'Assigned To', 'Created At'];
      const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
      const rows = tickets.map(t => [
        t.ticketId,
        escapeCsv(t.subject),
        t.category,
        t.priority,
        t.status,
        escapeCsv(t.raisedBy?.name),
        escapeCsv(t.assignedTo?.name || 'Unassigned'),
        new Date(t.createdAt).toLocaleDateString(),
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `supportdesk-report-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Analytics</h1>
          <p className="text-white/50">System-wide performance and SLA compliance overview</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            Export CSV
          </button>
          <Link to="/admin/panel" className="btn-primary flex items-center gap-2">
            <LayoutPanelLeft size={18} />
            System Panel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Volume" value={stats?.totalTickets || 0} icon={Ticket} color="purple" />
        <StatCard title="Overall Compliance" value={stats?.slaCompliance || '0%'} icon={Award} color="green" />
        <StatCard title="SLA Breaches" value={stats?.slaBreaches || 0} icon={Ban} color="red" />
        <StatCard title="Avg Resolution" value={stats?.avgResolutionHours || 'N/A'} icon={Users} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Distribution by Department</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    borderColor: '#ffffff10', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Ticket Status</h3>
          <div className="h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    borderColor: '#ffffff10', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-white/70 font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
