import { TrendingUp, TrendingDown } from 'lucide-react';
import cn from '../../utils/cn';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const StatIcon = Icon;
  const colorMap = {
    purple: 'text-brand-primary bg-brand-primary/10',
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    red: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="glass-card p-6 group">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 duration-300", colorMap[color] || colorMap.purple)}>
          <StatIcon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
          )}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-white/50">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
      
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", color === 'purple' ? 'bg-brand-primary' : 'bg-current')} 
          style={{ width: '65%' }} 
        />
      </div>
    </div>
  );
}
