import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real system, this would call POST /api/auth/forgot-password
    // For now, we show a confirmation message
    setSubmitted(true);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
              <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SupportDesk</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-white/50">Enter your email and we'll send you reset instructions</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <CheckCircle size={48} className="text-green-400" />
              </div>
              <p className="text-white font-semibold">Check your inbox!</p>
              <p className="text-sm text-white/50">
                If <span className="text-brand-primary">{email}</span> is registered, a reset link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-white/30 group-focus-within:text-brand-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-white/40">
            <Link to="/login" className="flex items-center justify-center gap-2 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
