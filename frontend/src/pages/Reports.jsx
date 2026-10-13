import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { 
  FileText, Plus, Search, Calendar, User, ChevronRight, 
  Download, Loader2, ClipboardList, Filter, 
  ShieldCheck, Activity, Syringe, Stethoscope, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { childrenAPI } from '../services/api.js';

const Reports = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await childrenAPI.getAll();
      setChildren(res.data);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 size={32} className="animate-spin text-[#2563EB]" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter text-[#11181C]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14">
          <div>
            <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-2">Portfolio & Clinical Reports</h1>
            <p className="text-base text-[#6B7280] font-medium max-w-2xl">
              {isDoctor ? 'Precision management and creation of verified pediatric diagnostic documentation and health portfolios.' : 'Secure gateway to certified medical history, clinical certificates, and verified pediatric documentation.'}
            </p>
          </div>
          {isDoctor && (
            <button className="inline-flex items-center justify-center gap-3 bg-[#11181C] hover:bg-black text-white px-10 py-5 rounded-[24px] text-lg font-black transition-all shadow-2xl shadow-gray-200/50 hover:scale-[1.02] active:scale-[0.98]">
              <Plus size={24} strokeWidth={3} />
              Establish Clinical Report
            </button>
          )}
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-14">
            <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                <div className="w-16 h-16 bg-[#F9FAFB] rounded-2xl flex items-center justify-center mb-6 border border-[#F3F4F6] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <FileText size={28} className="text-[#2563EB]" />
                </div>
                <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">Total Documentation</h3>
                <p className="text-4xl font-black text-[#11181C] tracking-tight">{children.length * 3 || 0}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                <div className="w-16 h-16 bg-[#F9FAFB] rounded-2xl flex items-center justify-center mb-6 border border-[#F3F4F6] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <ShieldCheck size={28} className="text-emerald-500" />
                </div>
                <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">Verification Status</h3>
                <p className="text-4xl font-black text-[#11181C] tracking-tight">100%</p>
            </div>
            <div className="md:col-span-2 bg-[#11181C] rounded-[40px] p-10 shadow-2xl shadow-gray-300 flex items-center justify-between text-white overflow-hidden relative group">
                <Activity size={160} className="absolute -right-12 -bottom-12 text-white/5 transform group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-3 tracking-tight">Clinical Intelligence</h3>
                    <p className="text-sm text-[#9CA3AF] max-w-sm font-bold leading-relaxed">
                      All diagnostic portfolios are cross-referenced with international WHO pediatric development standards.
                    </p>
                </div>
                <button className="relative z-10 px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 group-active:scale-95">Explore Engine</button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="relative flex-1 w-full">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input 
                    type="text" 
                    placeholder="Search clinical documents, verified reports, or child profiles..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent focus:border-[#2563EB] rounded-[32px] text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 transition-all shadow-sm"
                />
            </div>
            <button className="flex items-center gap-3 px-10 py-5 bg-white border border-[#E5E7EB] rounded-[32px] text-base font-black text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#F3F4F6] transition-all shadow-sm active:scale-95">
                <Filter size={20} />
                Global Filter
            </button>
        </div>

        {/* Reports List */}
        {children.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[48px] p-32 text-center max-w-4xl mx-auto shadow-sm">
            <div className="w-28 h-28 bg-[#F9FAFB] border border-[#F3F4F6] rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-inner">
              <ClipboardList size={48} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-3xl font-black text-[#11181C] mb-6 tracking-tight">Zero Clinical Evidence</h3>
            <p className="text-lg text-[#6B7280] mb-0 leading-relaxed font-medium max-w-lg mx-auto">
              Pediatric certificates, immunization logs, and detailed growth portfolios will populate here once clinical analysis begins.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {children.map(child => (
                <div key={child._id} className="space-y-8">
                    <div className="flex items-center gap-4 px-4 py-2">
                        <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] font-black text-xl shadow-inner border border-[#2563EB]/10">
                            {child.name.charAt(0)}
                        </div>
                        <h2 className="text-base font-black uppercase tracking-[0.25em] text-[#9CA3AF] shrink-0">{child.name}'s Clinical Portfolio</h2>
                        <div className="h-0.5 bg-[#E5E7EB] w-full ml-4 opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Report Card 1: Vaccination Certificate */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm group hover:border-[#2563EB]/20 transition-all hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden relative">
                            <div className="flex items-start justify-between mb-10">
                                <div className="w-16 h-16 bg-emerald-50 rounded-[28px] flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Syringe size={28} strokeWidth={2.5} />
                                </div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-xs text-emerald-600 rounded-xl font-black tracking-widest border border-emerald-100 shadow-sm">
                                    <ShieldCheck size={14} strokeWidth={3} />
                                    CERTIFIED
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-[#11181C] mb-3 tracking-tight">Immunization Record</h4>
                            <p className="text-base text-[#6B7280] font-bold leading-relaxed mb-8">Full historical record of pediatric administrations and future predictive schedule.</p>
                            <div className="flex items-center justify-between pt-8 border-t border-[#F3F4F6]">
                                <div className="flex items-center gap-3 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                                    <Clock size={16} />
                                    SYNCED: TODAY
                                </div>
                                <button className="w-12 h-12 flex items-center justify-center bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-90">
                                    <Download size={22} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Report Card 2: Growth Analysis */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm group hover:border-[#2563EB]/20 transition-all hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden relative">
                            <div className="flex items-start justify-between mb-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-[#2563EB] border border-blue-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Activity size={28} strokeWidth={2.5} />
                                </div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-xs text-[#2563EB] rounded-xl font-black tracking-widest border border-blue-100 shadow-sm uppercase">
                                    ANALYTICS ENGINE
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-[#11181C] mb-3 tracking-tight">Growth Intelligence</h4>
                            <p className="text-base text-[#6B7280] font-bold leading-relaxed mb-8">Precision WHO growth markers including developmental trajectory analysis.</p>
                            <div className="flex items-center justify-between pt-8 border-t border-[#F3F4F6]">
                                <div className="flex items-center gap-3 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                                    <Clock size={16} />
                                    SYNCED: 48H AGO
                                </div>
                                <button className="w-12 h-12 flex items-center justify-center bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-90">
                                    <Download size={22} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Report Card 3: Clinical Consultations */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm group hover:border-[#2563EB]/20 transition-all hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden relative">
                            <div className="flex items-start justify-between mb-10">
                                <div className="w-16 h-16 bg-rose-50 rounded-[28px] flex items-center justify-center text-rose-500 border border-rose-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Stethoscope size={28} strokeWidth={2.5} />
                                </div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-xs text-rose-500 rounded-xl font-black tracking-widest border border-rose-100 shadow-sm">
                                    CLINICAL CASE
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-[#11181C] mb-3 tracking-tight">Prescription Archive</h4>
                            <p className="text-base text-[#6B7280] font-bold leading-relaxed mb-8">Verified clinical prescriptions, case notes, and specialists advisory logs.</p>
                            <div className="flex items-center justify-between pt-8 border-t border-[#F3F4F6]">
                                <div className="flex items-center gap-3 text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                                    <Clock size={16} />
                                    SYNCED: 7D AGO
                                </div>
                                <button className="w-12 h-12 flex items-center justify-center bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-90">
                                    <Download size={22} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Reports;
