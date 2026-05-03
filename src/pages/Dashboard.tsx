import React, { useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  Tag,
  X,
  Megaphone,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Target as TargetIcon,
  CheckCircle2,
  Trash2,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Campaign {
  id: string;
  campaign_name: string;
  campaign_plan: string;
  description: string;
  start_date: string;
  end_date: string;
  target_audience: string;
  market: string;
  budget: number;
  actual_spend: number;
  variance: number;
  status: 'draft' | 'active' | 'completed';
  category: string;
  creatorId: string;
  createdAt: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [campaignPlan, setCampaignPlan] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [market, setMarket] = useState('');
  const [budget, setBudget] = useState(0);
  const [actualSpend, setActualSpend] = useState(0);
  const [category, setCategory] = useState('Social Media');

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
      setCampaigns(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'campaigns');
    });

    return unsubscribe;
  }, []);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const varValue = Number(budget) - Number(actualSpend);
      await addDoc(collection(db, 'campaigns'), {
        campaign_name: campaignName,
        campaign_plan: campaignPlan,
        description,
        start_date: startDate,
        end_date: endDate,
        target_audience: targetAudience,
        market,
        budget: Number(budget),
        actual_spend: Number(actualSpend),
        variance: varValue,
        status: 'draft',
        category,
        creatorId: user.uid,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'campaigns');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), {
        status: newStatus
      });
      setActiveMenu(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `campaigns/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await deleteDoc(doc(db, 'campaigns', id));
      setActiveMenu(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `campaigns/${id}`);
    }
  };

  const resetForm = () => {
    setCampaignName('');
    setCampaignPlan('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setTargetAudience('');
    setMarket('');
    setBudget(0);
    setActualSpend(0);
    setCategory('Social Media');
  };

  const categories = ['All', 'Social Media', 'Email', 'SEO', 'PPC', 'Content'];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.campaign_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totals = campaigns.reduce((acc, curr) => ({
    budget: acc.budget + (curr.budget || 0),
    spend: acc.spend + (curr.actual_spend || 0),
  }), { budget: 0, spend: 0 });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Header & Global Stats */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <h1 className="text-7xl font-extrabold tracking-tighter leading-[0.8] mb-1">
                    {greeting},
                  </h1>
                  <span className="text-5xl italic font-serif font-light text-ink/30 block ml-1">{user?.email?.split('@')[0]}</span>
                </div>
              </div>
            <p className="text-ink/60 text-lg leading-relaxed font-medium">
              Vantedge Core is active. Your strategic marketing matrix is synchronized and ready for command.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center gap-3 px-8 py-5 bg-emerald-deep text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/20"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Launch Initiative</span>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            label="Total Allocated" 
            value={`$${totals.budget.toLocaleString()}`} 
            icon={<DollarSign size={18} />}
            color="emerald"
          />
          <StatCard 
            label="Actual Burn" 
            value={`$${totals.spend.toLocaleString()}`} 
            icon={<TrendingUp size={18} />}
            color={totals.spend > totals.budget ? 'rose' : 'amber'}
          />
          <StatCard 
            label="Active Runs" 
            value={campaigns.filter(c => c.status === 'active').length.toString()} 
            icon={<Play size={18} />}
            color="indigo"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0a0a0a]/20 group-focus-within:text-emerald-deep transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Query directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-[#0a0a0a]/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-deep/5 text-sm font-medium transition-all"
          />
        </div>
        <div className="md:w-64 relative group">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0a0a0a]/20 group-focus-within:text-emerald-deep transition-colors" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-14 pr-10 py-5 bg-white border border-[#0a0a0a]/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-deep/5 text-sm font-bold appearance-none cursor-pointer transition-all uppercase tracking-widest"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Campaign Matrix */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-deep/10 border-t-emerald-deep rounded-full animate-spin" />
          <span className="text-sm font-bold uppercase tracking-widest opacity-20">Syncing Matrix...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "relative bg-white p-8 rounded-[2.5rem] border border-[#0a0a0a]/5 flex flex-col justify-between group overflow-visible",
                  "hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500",
                  "hover:-translate-y-1"
                )}
              >
                {/* Meta Row */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                       <StatusBadge status={campaign.status} />
                       <span className="px-3 py-1 bg-sand border border-[#0a0a0a]/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/40">
                         {campaign.category}
                       </span>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === campaign.id ? null : campaign.id)}
                        className="p-3 hover:bg-sand rounded-2xl text-[#0a0a0a]/20 hover:text-emerald-deep transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenu === campaign.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-[#0a0a0a]/5 p-2 z-50 overflow-hidden"
                          >
                            <MenuAction 
                              icon={<Play size={14} />} 
                              label="Set Active" 
                              onClick={() => handleUpdateStatus(campaign.id, 'active')} 
                              disabled={campaign.status === 'active'}
                            />
                            <MenuAction 
                              icon={<CheckCircle2 size={14} />} 
                              label="Mark Done" 
                              onClick={() => handleUpdateStatus(campaign.id, 'completed')}
                              disabled={campaign.status === 'completed'}
                            />
                            <MenuAction 
                              icon={<Trash2 size={14} />} 
                              label="Terminate" 
                              onClick={() => handleDelete(campaign.id)}
                              danger
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <h3 className="text-3xl font-extrabold tracking-tighter mb-3 group-hover:text-emerald-deep transition-colors leading-tight">
                    {campaign.campaign_name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <TagChip icon={<TargetIcon size={12} className="stroke-[2.5]" />} label={campaign.market} />
                    <TagChip icon={<Calendar size={12} className="stroke-[2.5]" />} label={campaign.campaign_plan} />
                  </div>

                  <p className="text-[#0a0a0a]/50 text-sm leading-relaxed mb-8 line-clamp-2 italic font-serif">
                    "{campaign.description || 'System-derived strategic initiative sequence.'}"
                  </p>
                </div>

                {/* Tracking Logic UI */}
                <div className="space-y-6 pt-6 border-t border-[#0a0a0a]/5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest">
                      <span className="opacity-40">Efficiency Index</span>
                      <span className={cn(
                        campaign.actual_spend > campaign.budget ? 'text-rose-500' : 'text-emerald-600'
                      )}>
                        {Math.round((campaign.actual_spend / campaign.budget) * 100 || 0)}% Burn
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((campaign.actual_spend / campaign.budget) * 100 || 0, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full transition-colors duration-500",
                          campaign.actual_spend > campaign.budget ? 'bg-rose-500' : 'bg-emerald-deep'
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="block text-[9px] font-extrabold uppercase text-[#0a0a0a]/20 mb-1">Cap</span>
                        <span className="font-bold text-sm">${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-px h-8 bg-[#0a0a0a]/5" />
                      <div className="text-center">
                        <span className="block text-[9px] font-extrabold uppercase text-[#0a0a0a]/20 mb-1">Burn</span>
                        <span className={cn(
                          "font-bold text-sm",
                          campaign.actual_spend > campaign.budget ? 'text-rose-500' : 'text-[#0a0a0a]'
                        )}>
                          ${campaign.actual_spend.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {campaign.actual_spend > campaign.budget && (
                      <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCampaigns.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 rounded-[3rem] border border-dashed border-[#0a0a0a]/10 bg-white/30">
              <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center mb-6">
                <Megaphone size={32} className="text-[#0a0a0a]/20" />
              </div>
              <p className="text-2xl font-bold tracking-tight opacity-40 mb-2">Null Sector</p>
              <p className="text-sm font-medium opacity-20 uppercase tracking-[0.3em]">No valid signatures found</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal - Enhanced */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] p-10 lg:p-16 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] relative overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 p-3 hover:bg-sand rounded-full transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 mb-12">
                <span className="px-4 py-1.5 bg-emerald-deep/10 text-emerald-deep rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                  Provision Logic
                </span>
                <h2 className="text-4xl font-bold tracking-tighter">Draft New Protocol</h2>
              </div>

              <form onSubmit={handleAddCampaign} className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormInput 
                    label="Signature Name" 
                    value={campaignName} 
                    onChange={setCampaignName} 
                    placeholder="Q4 Meta Growth" 
                    full 
                  />
                  <FormInput 
                    label="Strategic Plan" 
                    value={campaignPlan} 
                    onChange={setCampaignPlan} 
                    placeholder="Aggressive Retention" 
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-sand rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-deep/10 font-bold appearance-none transition-all cursor-pointer"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <FormInput 
                    label="Allocated Capital ($)" 
                    type="number" 
                    value={budget} 
                    onChange={(val) => setBudget(Number(val))} 
                  />
                  <FormInput 
                    label="Current Consumption ($)" 
                    type="number" 
                    value={actualSpend} 
                    onChange={(val) => setActualSpend(Number(val))} 
                  />
                  <FormInput 
                    label="Target Sector" 
                    value={market} 
                    onChange={setMarket} 
                    placeholder="Global/Enterprise" 
                  />
                  <FormInput 
                    label="Demographic" 
                    value={targetAudience} 
                    onChange={setTargetAudience} 
                    placeholder="Decision Makers" 
                  />
                  <div className="col-span-full space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Mission Objectives</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-6 py-4 bg-sand rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-deep/10 font-medium min-h-[120px] resize-none transition-all placeholder:opacity-20"
                      placeholder="Outline the primary objectives and KPIs..."
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    className="w-full py-6 bg-emerald-deep text-white rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 hover:translate-y-[-4px] active:translate-y-[0px] transition-all shadow-2xl shadow-emerald-900/40"
                  >
                    Deploy Campaign Sequence <ArrowUpRight size={20} />
                  </button>
                </div>
              </form>

              {/* Decorative elements in modal */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-deep/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for cleaner structure
function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'emerald' | 'amber' | 'rose' | 'indigo' }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn("p-6 bg-white rounded-[2rem] border border-[#0a0a0a]/5 flex items-center gap-5 transition-all shadow-sm")}
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", colors[color])}>
        {icon}
      </div>
      <div>
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-1">{label}</span>
        <span className="text-2xl font-bold tracking-tight">{value}</span>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    completed: 'bg-[#f5f5f4] text-[#0a0a0a]/40 border-[#0a0a0a]/5',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
  }[status as 'active' | 'completed' | 'draft'];

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      config
    )}>
      {status}
    </span>
  );
}

function MenuAction({ icon, label, onClick, danger, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all",
        danger ? "text-rose-500 hover:bg-rose-50" : "hover:bg-sand",
        disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TagChip({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-sand/50 rounded-lg text-[10px] font-bold text-[#0a0a0a]/30 uppercase tracking-widest border border-sand italic">
      {icon}
      {label}
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text', full = false }: { label: string, value: string | number, onChange: (v: string) => void, placeholder?: string, type?: string, full?: boolean }) {
  return (
    <div className={cn("space-y-2", full ? "col-span-full" : "")}>
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">{label}</label>
      <input 
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-sand rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-deep/10 font-bold transition-all placeholder:opacity-20"
      />
    </div>
  );
}
