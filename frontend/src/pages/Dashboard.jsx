import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { childrenAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import {
  Users, TrendingUp, Syringe, CalendarDays,
  ChevronRight, Loader2, AlertCircle, Bell, ArrowRight,
  ClipboardList
} from 'lucide-react';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const totalGrowth = children.reduce((t, c) => t + (c.growth_records?.length || 0), 0);
  const totalVaccines = children.reduce((t, c) => t + (c.vaccinations?.length || 0), 0);
  const totalAppts = children.reduce((t, c) => t + (c.appointments?.length || 0), 0);

  const stats = [
    { label: 'Children Tracking', value: children.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Growth Entries', value: totalGrowth, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Vaccinations', value: totalVaccines, icon: Syringe, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Appointments', value: totalAppts, icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-[#11181C] tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-[#6B7280] mt-3 text-lg font-medium leading-relaxed max-w-lg">
              Here is your synchronized family health overview for today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/children" 
              className="inline-flex items-center gap-3 bg-[#11181C] hover:bg-black text-white px-7 py-3.5 rounded-2xl text-base font-bold transition-all shadow-xl shadow-gray-200"
            >
              Go to Children
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-[32px] p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={26} className={stat.color} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-4xl font-black text-[#11181C] tracking-tight">{stat.value}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Important Alerts Section */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[#11181C] tracking-tight">Recent Profiles</h2>
                <Link to="/children" className="text-base font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors underline underline-offset-4">See all profiles</Link>
              </div>
              
              {children.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] border-dashed rounded-[40px] p-20 text-center">
                  <p className="text-[#6B7280] text-lg font-medium mb-8">No children added yet to your profile.</p>
                  <Link to="/children" className="inline-flex items-center gap-3 text-white bg-[#2563EB] px-8 py-4 rounded-2xl font-bold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-200">
                    Add your first child profile
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.slice(0, 4).map((child) => (
                    <Link
                      key={child._id}
                      to={`/children/${child._id}`}
                      className="flex items-center justify-between p-6 bg-white border border-[#E5E7EB] rounded-[28px] hover:border-[#2563EB]/40 hover:shadow-2xl hover:shadow-gray-200/40 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center text-[#11181C] font-black text-xl shadow-inner">
                          {child.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#11181C] group-hover:text-[#2563EB] transition-colors mb-0.5">{child.name}</h3>
                          <p className="text-sm text-[#9CA3AF] font-bold uppercase tracking-widest">{child.gender} · {new Date(child.dateOfBirth).getFullYear()}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[#11181C] tracking-tight">Health Intelligence</h2>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-[#EFF6FF] rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  <Bell size={36} className="text-[#2563EB]" />
                </div>
                <h3 className="text-2xl font-black text-[#11181C] mb-3">Immunization Reminders</h3>
                <p className="text-[#6B7280] text-base max-w-sm font-medium leading-relaxed mb-10">
                  AI-driven vaccination tracking based on your children's developmental stage and regional health protocols.
                </p>
                <div className="pt-10 border-t border-[#F3F4F6] w-full flex items-center justify-center gap-16">
                  <div className="text-center">
                    <p className="text-3xl font-black text-[#11181C]">0</p>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mt-2">DUE SOON</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-[#EF4444]">0</p>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EF4444]/60 mt-2">OVERDUE</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            <section className="bg-white border border-[#E5E7EB] rounded-[40px] p-8 shadow-sm">
              <h3 className="text-xl font-black text-[#11181C] mb-8">Quick Access</h3>
              <div className="space-y-4">
                {[
                  { label: 'View Reports', icon: ClipboardList, path: '/reports', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Vaccination Timeline', icon: Syringe, path: '/vaccines', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Growth Tracking', icon: TrendingUp, path: '/growth', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Scheduling', icon: CalendarDays, path: '/appointments', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((action, i) => {
                  const ActionIcon = action.icon;
                  return (
                    <Link
                      key={i}
                      to={action.path}
                      className="flex items-center gap-5 p-5 rounded-2xl bg-[#F9FAFB] hover:bg-white border-2 border-transparent hover:border-[#F3F4F6] transition-all group"
                    >
                      <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                        <ActionIcon size={22} className={action.color} />
                      </div>
                      <span className="text-base font-bold text-[#11181C] group-hover:text-[#2563EB] transition-colors">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="bg-[#11181C] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-gray-400">
              <div className="w-40 h-40 bg-white/5 rounded-full absolute -right-10 -bottom-10 blur-3xl transition-transform group-hover:scale-150 duration-700" />
              <h4 className="text-2xl font-black mb-4 leading-tight relative z-10">Health Support</h4>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-10 font-bold relative z-10">
                Secure clinical help or expert advice regarding your family's health synchronization and medical records.
              </p>
              <button className="w-full py-4 bg-white text-[#11181C] rounded-2xl text-sm font-black transition-all hover:bg-[#F9FAFB] hover:scale-[1.03] active:scale-[0.97] relative z-10">
                Contact Care Team
              </button>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
