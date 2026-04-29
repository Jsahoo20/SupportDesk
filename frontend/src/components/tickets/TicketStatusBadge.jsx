import cn from '../../utils/cn';

export default function TicketStatusBadge({ status, className }) {
  const statusStyles = {
    'Open': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'In Progress': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Resolved': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Closed': 'bg-white/5 text-white/50 border-white/10'
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
      statusStyles[status] || statusStyles['Open'],
      className
    )}>
      {status}
    </span>
  );
}
