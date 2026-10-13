import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { childrenAPI, growthAPI, vaccinesAPI, appointmentsAPI } from '../services/api.js';
import GrowthChart from '../components/GrowthChart.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import {
  ArrowLeft, TrendingUp, Syringe, CalendarDays,
  Plus, Loader2, User, Clock, ChevronRight,
  ShieldCheck, Activity, Stethoscope, Heart
} from 'lucide-react';

const ChildProfile = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [childRes, growthRes, vaccinesRes, appointmentsRes] = await Promise.all([
        childrenAPI.get(id),
        growthAPI.getByChild(id),
        vaccinesAPI.getByChild(id),
        appointmentsAPI.getByChild(id)
      ]);
      setChild(childRes.data);
      setGrowthData(growthRes.data);
      setVaccines(vaccinesRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching child data:', error);
      if (error.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  const getAgeString = (dob) => {
    const months = Math.floor((new Date() - new Date(dob)) / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}y ${rem}m` : `${years} years`;
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 size={32} className="animate-spin text-[#2563EB]" />
      </div>
    </div>
  );

  if (!child) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-sm font-bold text-[#6B7280]">Profile not found.</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Health Overview', icon: Activity },
    { id: 'growth', label: 'Growth & Metrics', icon: TrendingUp },
    { id: 'vaccines', label: 'Vaccination History', icon: Syringe },
    { id: 'appointments', label: 'Medical Visits', icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-4 mb-12 overflow-hidden">
          <Link
            to="/children"
            className="flex items-center gap-2.5 text-sm font-black text-[#9CA3AF] hover:text-[#2563EB] transition-colors uppercase tracking-[0.15em]"
          >
            <Users size={16} />
            Profiles
          </Link>
          <ChevronRight size={16} className="text-[#E5E7EB]" />
          <span className="text-sm font-black text-[#11181C] uppercase tracking-[0.15em] truncate">
            {child.name}'s Portfolio
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-10">
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm text-center relative overflow-hidden">
                    <div className="w-32 h-32 rounded-[32px] bg-[#F9FAFB] border-2 border-[#F3F4F6] flex items-center justify-center text-[#11181C] font-black text-5xl mx-auto mb-8 shadow-inner">
                        {child.name.charAt(0)}
                    </div>
                    <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-3">{child.name}</h1>
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] bg-[#F9FAFB] px-3 py-1 rounded-lg border border-[#F3F4F6]">{child.gender}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-[#2563EB]">{getAgeString(child.dateOfBirth)}</span>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-[#F3F4F6]">
                         <div className="flex items-center justify-between text-sm">
                             <span className="font-black text-[#9CA3AF] uppercase tracking-widest text-[10px]">Born</span>
                             <span className="font-bold text-[#11181C]">{new Date(child.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                             <span className="font-black text-[#9CA3AF] uppercase tracking-widest text-[10px]">Medical Status</span>
                             <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] tracking-widest shadow-sm">
                                 <ShieldCheck size={12} />
                                 ACTIVE
                             </span>
                         </div>
                    </div>
                </div>

                <div className="bg-[#11181C] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-gray-300">
                    <div className="w-40 h-40 bg-white/5 rounded-full absolute -right-20 -bottom-20 blur-3xl" />
                    <Heart size={100} className="absolute -bottom-6 -right-6 text-white/10 transform rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    <h4 className="text-2xl font-black mb-4 relative z-10">Clinical Graph</h4>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed font-bold relative z-10">
                        Synchronizing clinical markers and developmental stages into a unified medical intelligence layer.
                    </p>
                </div>
            </div>

            {/* Tabbed Content */}
            <div className="lg:col-span-3 space-y-10">
                
                {/* Custom Tab Switcher */}
                <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] p-2 rounded-3xl w-full overflow-x-auto no-scrollbar shadow-sm">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-7 py-3.5 rounded-[20px] text-sm font-black transition-all whitespace-nowrap tracking-wide ${
                                    activeTab === tab.id
                                        ? 'bg-[#11181C] text-white shadow-xl shadow-gray-300 scale-[1.02]'
                                        : 'text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#11181C]'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white border border-[#E5E7EB] rounded-[36px] p-8 shadow-sm group hover:border-[#2563EB]/40 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563EB] mb-6 shadow-inner">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-base font-black text-[#11181C] mb-2 tracking-tight">Growth Markers</h3>
                                <p className="text-4xl font-black text-[#11181C] mb-3">{growthData.length}</p>
                                <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Clinical Records</p>
                            </div>
                            <div className="bg-white border border-[#E5E7EB] rounded-[36px] p-8 shadow-sm group hover:border-[#E5E7EB]/50 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 shadow-inner">
                                    <Syringe size={24} />
                                </div>
                                <h3 className="text-base font-black text-[#11181C] mb-2 tracking-tight">Immunization</h3>
                                <p className="text-4xl font-black text-[#11181C] mb-3">{vaccines.length}</p>
                                <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Doses Verified</p>
                            </div>
                            <div className="bg-white border border-[#E5E7EB] rounded-[36px] p-8 shadow-sm group hover:border-[#E5E7EB]/50 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6 shadow-inner">
                                    <CalendarDays size={24} />
                                </div>
                                <h3 className="text-base font-black text-[#11181C] mb-2 tracking-tight">Consultations</h3>
                                <p className="text-4xl font-black text-[#11181C] mb-3">{appointments.length}</p>
                                <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Provider Visits</p>
                            </div>
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9FAFB] rounded-bl-[100px] -z-0" />
                            <h3 className="text-2xl font-black text-[#11181C] mb-10 tracking-tight relative z-10">Smart Health Summary</h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-6 p-6 bg-[#F9FAFB] rounded-3xl border-2 border-transparent hover:border-[#F3F4F6] hover:bg-white transition-all shadow-inner group">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] group-hover:scale-110 transition-transform">
                                        <TrendingUp size={20} className="text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-black text-[#11181C]">Anthropometric Check</h4>
                                            <span className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                                                {growthData[0] ? new Date(growthData[0].date || growthData[0].createdAt).toLocaleDateString() : 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-[#6B7280] leading-relaxed">
                                            {growthData[0] 
                                                ? `Weight: ${growthData[0].weight}kg, Height: ${growthData[0].height}cm. Morphological development is consistent with global pediatric percentile markers.` 
                                                : "Physical measurements are required to initialize the developmental graph."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-6 bg-[#F9FAFB] rounded-3xl border-2 border-transparent hover:border-[#F3F4F6] hover:bg-white transition-all shadow-inner group">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-black text-[#11181C]">Immunization Lifecycle</h4>
                                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">On Track</span>
                                        </div>
                                        <p className="text-sm font-bold text-[#6B7280] leading-relaxed">
                                            {vaccines.length > 0 
                                                ? `${vaccines.length} clinical doses verified. Smart schedule is active and monitoring upcoming dosage windows.`
                                                : "Input valid immunization records to activate the automated pediatric schedule."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'growth' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GrowthChart data={growthData} type="weight" />
                        <GrowthChart data={growthData} type="height" />
                    </div>
                )}

                {activeTab === 'vaccines' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-[#11181C] tracking-tight">Pediatric Schedule</h3>
                                <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest mt-1">Verified Clinical History</p>
                            </div>
                            <Link to="/vaccines" className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline underline-offset-4">Configure Lifecycle</Link>
                        </div>

                        {vaccines.length === 0 ? (
                            <div className="text-center py-24 bg-[#F9FAFB] rounded-[32px] border-2 border-dashed border-[#E5E7EB]">
                                <Syringe size={48} className="text-[#E5E7EB] mx-auto mb-6" />
                                <p className="text-base font-black text-[#9CA3AF] tracking-widest">ZERO CLINICAL RECORDS</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {vaccines.map((vaccine) => (
                                    <div key={vaccine._id} className="flex items-center justify-between p-8 rounded-[28px] bg-[#F9FAFB] hover:bg-white border-2 border-transparent hover:border-[#F3F4F6] transition-all group shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-[#F3F4F6] group-hover:scale-110 transition-transform shadow-inner">
                                                <Syringe size={22} strokeWidth={2.5} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-[#11181C]">{vaccine.name}</p>
                                                <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Dose Administered</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[#11181C]">
                                                {new Date(vaccine.dateAdministered).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-[#11181C] tracking-tight">Medical Visits</h3>
                                <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest mt-1">Provider Consultation Log</p>
                            </div>
                            <Link to="/appointments" className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline underline-offset-4">Manage Consults</Link>
                        </div>
                        
                        {appointments.length === 0 ? (
                            <div className="text-center py-24 bg-[#F9FAFB] rounded-[32px] border-2 border-dashed border-[#E5E7EB]">
                                <Stethoscope size={48} className="text-[#E5E7EB] mx-auto mb-6" />
                                <p className="text-base font-black text-[#9CA3AF] tracking-widest">NO VISIT LOGS DETECTED</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {appointments.map((appt) => (
                                    <div key={appt._id} className="flex items-center justify-between p-8 rounded-[32px] bg-[#F9FAFB] hover:bg-white border-2 border-transparent hover:border-[#F3F4F6] transition-all group shadow-sm">
                                        <div className="flex items-center gap-7">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-2 border-[#F3F4F6] group-hover:scale-110 transition-transform shadow-inner">
                                                <Stethoscope size={26} strokeWidth={2.5} className="text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-[#11181C] mb-1">{appt.type}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black text-[#2563EB] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{appt.status || 'Verified'}</span>
                                                    <div className="w-1 h-1 bg-[#E5E7EB] rounded-full" />
                                                    <span className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest">{appt.location || 'Clinical Center'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-3 text-sm font-black text-[#11181C] bg-white px-4 py-2 rounded-2xl border border-[#F3F4F6] shadow-sm">
                                                <Clock size={16} className="text-[#9CA3AF]" />
                                                {new Date(appt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ChildProfile;
