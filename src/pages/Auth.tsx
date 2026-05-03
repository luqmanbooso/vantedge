import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  Fingerprint,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase Console.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error: Authentication servers unreachable.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-deep relative flex-col items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-white/5 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center text-white"
        >
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-12 mx-auto border border-white/20 shadow-2xl">
            <Fingerprint size={48} className="text-white/80" />
          </div>
          <h1 className="text-7xl font-bold tracking-tighter mb-8 italic font-serif">Secure Entry.</h1>
          <p className="text-xl text-white/50 max-w-sm mx-auto leading-relaxed font-medium">
            Provision your node and synchronize with the CampaignHub global directory. Hardened security protocols active.
          </p>
        </motion.div>
        
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          <span>Shield Active</span>
          <span>Verified Node Sequence</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 relative min-h-screen">
        <Link to="/" className="lg:hidden absolute top-12 left-12 flex items-center gap-3">
           <div className="w-8 h-8 bg-emerald-deep rounded-[10px]" />
           <span className="font-bold tracking-tighter text-2xl">Vantedge</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-5xl font-bold tracking-tighter mb-4">
              {isLogin ? 'Initiate Session' : 'Draft Identifier'}
            </h2>
            <p className="text-ink/40 font-medium text-lg leading-snug">
              {isLogin ? 'Access your marketing strategic metrics.' : 'Create a new synchronized agent node.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-500 text-sm font-bold"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-30 ml-2">Identity Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-emerald-deep transition-colors" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@matrix.com"
                  className="w-full pl-14 pr-6 py-5 bg-white border border-ink/5 rounded-[2rem] focus:outline-none focus:ring-[12px] focus:ring-emerald-deep/5 font-bold transition-all placeholder:opacity-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-30 ml-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-emerald-deep transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-white border border-ink/5 rounded-[2rem] focus:outline-none focus:ring-[12px] focus:ring-emerald-deep/5 font-bold transition-all placeholder:opacity-20"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-emerald-deep text-white rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 hover:translate-y-[-4px] active:translate-y-[0px] transition-all shadow-2xl shadow-emerald-900/30 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  {isLogin ? 'Grant Access' : 'Create Identifier'}
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>

          <div className="my-12 flex items-center gap-6">
             <div className="flex-1 h-px bg-ink/5" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-20 whitespace-nowrap">External Synchronize</span>
             <div className="flex-1 h-px bg-ink/5" />
          </div>

          <button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-5 bg-white border border-ink/5 text-ink rounded-[2rem] font-bold flex items-center justify-center gap-4 hover:bg-emerald-soft transition-all group shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
            <span>Identity: Google Account</span>
          </button>

          <p className="mt-12 text-center text-sm font-medium text-ink/40">
            {isLogin ? "No identity sequence?" : "Identifier already provisioned?"} {' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-deep font-bold hover:underline"
            >
              {isLogin ? 'Draft Identifier' : 'Initiate Session'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
