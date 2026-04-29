import cn from '../../utils/cn';

export default function TicketPriorityBadge({ priority, className }) {
  const priorityStyles = {
    'critical': 'bg-red-500/10 text-red-500 border-red-500/20',
    'high': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'medium': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'low': 'bg-green-500/10 text-green-500 border-green-500/20'
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
      priorityStyles[priority] || priorityStyles['medium'],
      className
    )}>
      {priority}
    </span>
  );
}
