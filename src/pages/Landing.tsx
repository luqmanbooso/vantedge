import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, BarChart3, Filter, ShieldCheck, Zap, Globe, Target, Cpu } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-sand overflow-hidden">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-deep/5 rounded-full border border-emerald-deep/10">
              <span className="w-2 h-2 bg-emerald-deep rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-deep">Enterprise Edition v2.4</span>
            </div>
            
            <h1 className="text-8xl md:text-[10rem] font-bold font-sans leading-[0.8] tracking-tighter mb-10 text-emerald-deep select-none">
              Strategic <br />
              <span className="italic font-serif font-extralight text-ink opacity-40">Precision.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-ink/60 max-w-xl mb-12 leading-tight font-medium">
              The high-performance directory for marketing logic. Track initiatives, optimize capital, and scale with verifiable data integrity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to="/auth" 
                className="group relative px-10 py-6 bg-emerald-deep text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-900/30 overflow-hidden"
              >
                <span className="relative z-10">Provision Access</span>
                <ArrowUpRight size={22} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link 
                to="/dashboard" 
                className="px-10 py-6 bg-white border border-ink/5 rounded-2xl text-lg font-bold hover:bg-emerald-soft transition-colors flex items-center justify-center"
              >
                Matrix Probe
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square">
              {/* Main feature image - Modern architecture represention of "structure" */}
              <div className="absolute inset-0 rounded-[4rem] overflow-hidden rotate-3 shadow-2xl shadow-emerald-900/10">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  alt="Modern Structure" 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-emerald-deep/20 mix-blend-overlay" />
              </div>
              
              {/* Floating detail UI elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 p-8 glass rounded-[2.5rem] shadow-xl max-w-[280px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-deep rounded-xl flex items-center justify-center text-white">
                    <Target size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase opacity-30 tracking-widest">Efficiency</div>
                    <div className="text-lg font-bold tracking-tight">98.4% Sync</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-sand rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-deep rounded-full" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 p-8 glass rounded-[2.5rem] shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-30 leading-none mb-1">Global Load</div>
                    <div className="text-xl font-bold font-mono tracking-tighter">1.2ms</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-emerald-deep blur-[160px] rounded-full scale-110" />
        </div>
      </section>

      {/* Grid Features Section - Hardware aesthetic */}
      <section className="px-6 py-32 bg-white border-y border-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 grid md:grid-cols-2 gap-8 items-end">
            <h2 className="text-6xl font-bold tracking-tighter leading-none">
              Systems of <br />
              <span className="text-emerald-deep">Growth.</span>
            </h2>
            <p className="text-xl text-ink/40 font-medium">
              We provide the underlying infrastructure for modern marketing teams to operate at maximum velocity.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Cpu />}
              title="Logic Engine"
              description="Hardened Firestore rules ensuring 100% data integrity for every initiative line item."
            />
            <FeatureCard 
              icon={<Globe />}
              title="Total Reach"
              description="Coordinate multi-market campaigns with a single centralized source of truth."
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title="Verified Sec"
              description="Zero-trust authentication protocols securing your most sensitive strategic data."
            />
            <FeatureCard 
              icon={<Zap />}
              title="Sub-ms Sync"
              description="Real-time document synchronization across desktop and mobile nodes instantly."
            />
          </div>
        </div>
      </section>

      {/* Proof Section - Clean/Minimal */}
      <section className="px-6 py-32 bg-sand">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-emerald-deep p-16 lg:p-24 relative overflow-hidden text-white">
          <div className="max-w-2xl relative z-10">
            <h3 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-10 leading-[0.9]">
              Built for teams <br />
              that build <span className="italic font-serif font-light opacity-60">Future.</span>
            </h3>
            <p className="text-xl text-white/60 mb-12 leading-relaxed">
              CampaignHub is more than a directory—it's a control surface for the next decade of digital growth. Zero friction, total control.
            </p>
            <Link 
              to="/auth" 
              className="inline-flex h-20 w-20 items-center justify-center bg-white text-emerald-deep rounded-full hover:scale-110 transition-transform active:scale-95"
            >
              <ArrowUpRight size={32} />
            </Link>
          </div>
          
          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="px-6 py-20 bg-sand border-t border-ink/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-deep rounded-[10px]" />
            <span className="font-bold tracking-tighter text-xl">Vantedge</span>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">
            <a href="#" className="hover:text-emerald-deep transition-colors">Strategic Protocols</a>
            <a href="#" className="hover:text-emerald-deep transition-colors">API documentation</a>
            <a href="#" className="hover:text-emerald-deep transition-colors">Privacy layer</a>
          </div>
          <div className="text-[10px] font-bold opacity-20">
            © 2026 LOGIC ENGINE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-ink/5 bg-sand/30 hover:bg-white transition-all duration-500 group relative overflow-hidden">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-ink/5 group-hover:bg-emerald-deep group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24, className: "stroke-[2.5]" }) : icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tighter relative z-10">{title}</h3>
      <p className="text-ink/50 text-sm leading-relaxed font-bold uppercase tracking-widest relative z-10">{description}</p>
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-deep/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}
