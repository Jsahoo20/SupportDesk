import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import { DEPARTMENTS } from '../constants/app';

export default function Register() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join SupportDesk to manage requests efficiently
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
              <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <span className="text-xs text-destructive ml-1">{errors.name.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && <span className="text-xs text-destructive ml-1">{errors.email.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Department</label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                    <Briefcase size={18} />
                  </div>
                  <select
                    {...register('department', { required: 'Required' })}
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-black">Select</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept} className="bg-black">{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && <span className="text-xs text-destructive ml-1">{errors.department.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <span className="text-xs text-destructive ml-1">{errors.password.message}</span>}
              </div>
            </div>

            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full mt-4"
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
