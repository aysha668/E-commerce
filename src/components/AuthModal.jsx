import React, { useState } from 'react';
import { X, User, ShieldCheck, ArrowRight, Lock, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (emailToLogin, passwordToLogin) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToLogin || email,
          password: passwordToLogin || password || 'password'
        })
      });

      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend auth API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade">
      <div className="relative w-full max-w-md glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/95 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white brand-font">Role Access & Login</h3>
              <p className="text-xs text-slate-400">Switch role or sign in with account</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Switcher Buttons */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Demo One-Click Sign In</p>

          <button
            onClick={() => handleLogin('user@lumina.com', 'user123')}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Alex Johnson (User)</p>
                <p className="text-[10px] text-slate-400">user@lumina.com • Browse & Track Orders</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleLogin('admin@lumina.com', 'admin123')}
            className="w-full p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-500 text-left flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-200">Devika Admin (Admin)</p>
                <p className="text-[10px] text-purple-300/70">admin@lumina.com • Manage Products & Orders</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest">Or Login With Credentials</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@domain.com"
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl"
          >
            {loading ? 'Authenticating...' : 'Sign In / Auto-Register'}
          </button>
        </form>

      </div>
    </div>
  );
}
