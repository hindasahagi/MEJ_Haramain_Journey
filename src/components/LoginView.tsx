import React, { useState } from 'react';
import { safeAuth } from '../firebase';
import { UserRole } from '../types';
import { Mail, Lock, ShieldCheck, Plane, Eye, EyeOff, Loader2, Play } from 'lucide-react';
import { motion } from 'motion/react';
import logoImage from '../assets/images/mej_sacred_logo_1781250804856.jpg';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [role, setRole] = useState<UserRole>('Administrator');
  const [email, setEmail] = useState('admin@sacredjourney.me');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Administrator Unit A');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Small simulated delay for pristine UX transitions
      await new Promise((resolve) => setTimeout(resolve, 800));

      let user;
      if (isRegisterMode) {
        user = await safeAuth.signUp(email, name, role, password);
      } else {
        user = await safeAuth.signIn(email, role, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-50">
      {/* Left: Cinematic Visual Brand Panel */}
      <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center">
        {/* Background Image with Luminosity blend */}
        <div className="absolute inset-0 z-0 select-none">
          <img
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105 pointer-events-none"
            alt="The Great Mosque in Mecca"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8sKJwNEFrXhvv5q7FS-QurqooFvHMA2fV9sVjgHnpeG7UQnubCnVbfFwEwkjrLFM7iWJ_Mkt_4yyO2DJZOMs-5O6sU0eSkvg2sYewOtRrertbpgTOXeYP3yzIpg49y_WKTD1VyUaRo9oqnExd9ZPweObs0jK50RXP7bMo6CjNDyoMKWLL7QLaG0XoAld0qSP5iK75XKMhDfH3qfDCL8qbk9nt1X1W9TS0VpIDJj-NFffBOxvqobRmwXfXDBPmYSnNFMfDGuUGuNo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8">
            <img
              referrerPolicy="no-referrer"
              alt="MEJ Sacred Journey Logo White"
              className="h-16 w-16 rounded-2xl object-cover shadow-2xl border border-white/15"
              src={logoImage}
            />
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Legally Guided, Spiritually Fulfilled.
          </h1>
          <p className="font-body-lg text-indigo-200/90 leading-relaxed mb-8 text-base">
            Connecting administrative precision with spiritual significance. Experience a seamless management ecosystem designed for the most sacred journeys of a lifetime.
          </p>

          <div className="flex gap-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-indigo-400 w-5 h-5" />
              <span className="text-xs tracking-wide uppercase font-semibold text-slate-200">Secure VFS Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="text-indigo-400 w-5 h-5 rotate-45" />
              <span className="text-xs tracking-wide uppercase font-semibold text-slate-200">Logistics Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Interactive Forms Control */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative bg-slate-50">
        <div className="md:hidden mb-8 text-center">
          <img
            referrerPolicy="no-referrer"
            alt="MEJ Sacred Journey Logo Mobile"
            className="h-14 w-14 rounded-2xl object-cover mx-auto mb-2 shadow-md border border-slate-200"
            src={logoImage}
          />
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sacred Journey</h2>
        </div>

        {/* Login Core Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200"
        >
          <header className="mb-6 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-slate-500">
              {isRegisterMode ? 'Register a new manager profile' : 'Access your management portal'}
            </p>
          </header>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Select Portal Role
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {(['Administrator', 'Admin', 'Supervisor'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`text-xs py-2 rounded-md font-medium transition-all ${
                      role === r
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abdullah bin Ahmed"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm select-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-body-md"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sacredjourney.me"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm select-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-body-md"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-600" htmlFor="password">
                  Password
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => alert("Simulated: Use default password 'password123'")}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-body-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stay signed in checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer select-none">
                Stay signed in for 30 days
              </label>
            </div>

            {/* Submit btn */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {isRegisterMode ? 'Sign Up' : 'Sign In'}
                  <Play className="w-3 h-3 fill-current" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              {isRegisterMode
                ? 'Already have an administrative account? Sign In'
                : "Don't have an account? Register Profile"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need assistance?{' '}
              <button
                onClick={() => alert('Support line open. Contact support@sacredjourney.me')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Contact Support
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 w-full max-w-[440px] text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div className="space-y-1">
              <p>© 2024 Middle East Journey Sacred Journey Management System.</p>
              <div className="flex justify-center md:justify-start gap-4 text-indigo-500 font-semibold underline-none hover:underline">
                <a href="#privacy">Privacy Policy</a>
                <a href="#storage">Storage Policy</a>
                <a href="#support">Support</a>
              </div>
            </div>
            <div className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">v2.4.0</span>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
