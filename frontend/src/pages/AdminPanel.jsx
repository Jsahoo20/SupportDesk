import { useMemo, useState } from 'react';
import { 
  Users, 
  Shield, 
  UserCheck, 
  Mail, 
  Briefcase,
  Loader2,
  Filter
} from 'lucide-react';
import useFetch from '../hooks/useFetch';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { ROLE_FILTERS } from '../constants/app';
import cn from '../utils/cn';

export default function AdminPanel() {
  const { data: users, loading, refetch } = useFetch(ENDPOINTS.AUTH.USERS);
  const [updatingId, setUpdatingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (roleFilter === 'All') return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const handleRoleUpdate = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await api.put(ENDPOINTS.AUTH.UPDATE_ROLE(userId), { role: newRole });
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Hub</h1>
          <p className="text-white/50">Manage enterprise access and personnel permissions</p>
        </div>
      </div>

      <div className="glass-card">
        <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-brand-primary" />
            <div>
              <h2 className="text-xl font-bold text-white">Corporate Personnel</h2>
              <p className="text-sm text-white/40">
                Showing {filteredUsers.length} of {users?.length || 0} users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <Filter size={14} className="text-brand-primary" />
              Filter Role
            </div>
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
              {ROLE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setRoleFilter(filter)}
                  className={cn(
                    'px-4 py-2 rounded-md text-xs font-bold transition-all',
                    roleFilter === filter
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Full Identity</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Portal Role</th>
                <th className="px-6 py-4">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-12 bg-white/5 rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : (
                filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-brand-primary font-bold">
                            {user.name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{user.name}</span>
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/70 flex items-center gap-2">
                          <Briefcase size={14} className="text-white/20" /> {user.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40 font-medium">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          user.role === 'Admin' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                          user.role === 'Support' ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' :
                          'bg-white/5 border-white/10 text-white/40'
                        )}>
                          {user.role === 'Admin' ? <Shield size={10} /> : <UserCheck size={10} />}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === user._id}
                            value={user.role}
                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white/70 focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
                          >
                            <option value="Employee" className="bg-black">Employee</option>
                            <option value="Support" className="bg-black">Support</option>
                            <option value="Admin" className="bg-black">Admin</option>
                          </select>
                          {updatingId === user._id && <Loader2 className="animate-spin text-brand-primary" size={14} />}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/40">
                      No {roleFilter === 'All' ? 'users' : roleFilter.toLowerCase()} found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
