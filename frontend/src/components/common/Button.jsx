import { Loader2 } from 'lucide-react';
import cn from '../../utils/cn';

export default function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className,
  disabled,
  ...props 
}) {
  const baseStyles = "relative overflow-hidden flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-[0.98] px-6 py-2.5",
    secondary: "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white px-6 py-2.5",
    ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/5 px-4 py-2",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 px-6 py-2.5"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {!isLoading && children}
    </button>
  );
}
