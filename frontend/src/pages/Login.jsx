import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import { DASHBOARD_BY_ROLE } from '../constants/app';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await login(data.email, data.password);
      navigate(location.state?.from?.pathname || DASHBOARD_BY_ROLE[user.role] || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          {/* Logo + Brand Name */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
              <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SupportDesk</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your support portal
          </p>
        </div>

        <div className="glass-card p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <span className="text-xs text-destructive ml-1">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-white/70">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="text-xs text-destructive ml-1">{errors.password.message}</span>}
            </div>

            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full mt-4"
            >
              Sign In
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
