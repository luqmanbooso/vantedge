import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, LayoutDashboard, Target, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Matrix', icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <nav className="sticky top-0 z-[80] transition-all">
       <div className="bg-sand/80 backdrop-blur-xl border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-10 h-10 bg-emerald-deep rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-emerald-900/20"
              >
                <Target size={22} className="stroke-[2.5]" />
              </motion.div>
              <span className="font-bold tracking-tighter text-2xl hidden sm:block group-hover:text-emerald-deep transition-colors tracking-[-0.05em]">Vantedge</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-6 pl-8 border-l border-ink/5">
                <div className="flex items-center gap-2 text-emerald-deep font-bold text-[10px] uppercase tracking-[0.4em] opacity-40">
                  <Clock size={12} className="stroke-[3]" />
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-8">
            {user && (
              <div className="hidden md:flex items-center gap-2 pr-8 border-r border-ink/5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                      location.pathname === link.path 
                        ? "text-emerald-deep bg-emerald-deep/5" 
                        : "text-ink/40 hover:text-ink hover:bg-sand"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </span>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute inset-0 bg-emerald-deep/5 rounded-full -z-10 border border-emerald-deep/10"
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/20 leading-none mb-1">Authenticated Identifier</span>
                    <span className="text-[11px] font-bold text-emerald-deep truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-3 bg-white border border-ink/5 rounded-2xl text-ink/40 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all group"
                    title="Terminate Session"
                  >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-6 py-3 bg-emerald-deep text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all text-center min-w-[120px]"
                >
                  Access Matrix
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-deep/20 to-transparent" />
    </nav>
  );
}
