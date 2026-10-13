import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { childrenAPI, vaccinesAPI } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import { 
  Loader2, Syringe, ShieldCheck, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Calendar, Info
} from 'lucide-react';
import { VACCINE_SCHEDULE, calculateDueDate, getVaccineStatus } from '../utils/vaccineSchedule.js';

const Vaccines = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [completedVaccines, setCompletedVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await childrenAPI.getAll();
      setChildren(res.data);
      if (res.data.length > 0) {
        setSelectedChild(res.data[0]);
        fetchVaccines(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccines = async (childId) => {
    setDataLoading(true);
    try {
      const res = await vaccinesAPI.getByChild(childId);
      setCompletedVaccines(res.data);
    } catch (error) {
      console.error('Error fetching vaccine history:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChildChange = (child) => {
    setSelectedChild(child);
    fetchVaccines(child._id);
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 size={32} className="animate-spin text-[#2563EB]" />
      </div>
    </div>
  );

  // Status mapping
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Administered' },
    upcoming: { icon: Clock, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', border: 'border-[#DBEAFE]', label: 'Scheduled' },
    overdue: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Overdue' }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">
          <div>
            <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-2">Smart Vaccination Schedule</h1>
            <p className="text-base text-[#6B7280] font-medium max-w-2xl">
              Precision automated tracking synchronized with the Indian Pediatric Vaccination protocols for optimal developmental protection.
            </p>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#F9FAFB] border border-[#F3F4F6] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Syringe size={40} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-2xl font-black text-[#11181C] mb-4">No health profiles detected</h3>
            <p className="text-base text-[#6B7280] mb-12 max-w-sm mx-auto leading-relaxed font-medium">
              Establish a child profile to generate a personalized, intelligence-driven vaccination lifecycle.
            </p>
            <Link to="/children" className="inline-flex items-center gap-3 bg-[#11181C] text-white px-10 py-5 rounded-2xl text-base font-black hover:bg-black transition-all shadow-2xl shadow-gray-200/50">
              Go to Profiles Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Stats & Selector */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-[#E5E7EB] rounded-[36px] p-8 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#9CA3AF] mb-6 ml-2">Select Active Profile</h3>
                <div className="space-y-3">
                  {children.map(child => (
                    <button
                      key={child._id}
                      onClick={() => handleChildChange(child)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                        selectedChild?._id === child._id
                          ? 'bg-[#EFF6FF] border-[#2563EB]/20 text-[#2563EB] shadow-lg shadow-blue-50'
                          : 'bg-white border-transparent text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#F3F4F6]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner ${
                        selectedChild?._id === child._id ? 'bg-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      }`}>
                        {child.name?.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-base font-black leading-tight tracking-tight">{child.name}</p>
                        <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mt-1">{child.gender}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#11181C] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-gray-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-3xl transition-transform group-hover:scale-150" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <ShieldCheck size={36} className="text-[#2563EB]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-xl text-gray-300 backdrop-blur-md">PROTOCOL ACTIVE</span>
                </div>
                <h4 className="text-2xl font-black mb-3 relative z-10">Clinical Graph</h4>
                <p className="text-sm text-[#9CA3AF] leading-relaxed font-bold relative z-10">
                  Precision timeline synthesis using verified Indian pediatric healthcare standards.
                </p>
              </div>
            </div>

            {/* Smart Timeline Container */}
            <div className="lg:col-span-3">
              {dataLoading ? (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 flex flex-col items-center justify-center text-center shadow-sm">
                  <Loader2 size={40} className="animate-spin text-[#2563EB] mb-6" />
                  <p className="text-lg font-black text-[#11181C] tracking-tight">Recalculating lifecycle for {selectedChild?.name}...</p>
                </div>
              ) : (
                <div className="space-y-14">
                  {VACCINE_SCHEDULE.map((milestone, mIdx) => {
                    const dueDate = calculateDueDate(selectedChild.dateOfBirth, milestone.age);
                    
                    return (
                      <div key={mIdx} className="relative">
                        <div className="flex items-center gap-6 mb-10">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-[#F3F4F6] shadow-sm transform -rotate-3 transition-transform hover:rotate-0">
                            <Calendar size={24} className="text-[#11181C]" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-[#11181C] tracking-tight">{milestone.age}</h3>
                            <p className="text-sm font-black text-[#6B7280] uppercase tracking-widest mt-1">
                              Clinical window: {dueDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-[#E5E7EB] to-transparent ml-6" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-8 pl-12 border-l-3 border-[#F3F4F6] pb-4">
                          {milestone.vaccines.map((v, vIdx) => {
                            const isCompleted = completedVaccines.some(cv => cv.name?.toLowerCase() === v.name.toLowerCase());
                            const status = getVaccineStatus(dueDate, isCompleted);
                            const config = statusConfig[status];
                            const StatusIcon = config.icon;

                            return (
                              <div 
                                key={vIdx} 
                                className={`group relative p-8 bg-white border border-[#E5E7EB] rounded-[32px] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1.5`}
                              >
                                <div className="flex items-start justify-between mb-6">
                                  <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center border-2 ${config.border} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    <Syringe size={22} strokeWidth={2.5} className={config.color} />
                                  </div>
                                  <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl ${config.bg} border ${config.border} shadow-sm`}>
                                    <StatusIcon size={14} className={config.color} />
                                    <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${config.color}`}>
                                      {config.label}
                                    </span>
                                  </div>
                                </div>
                                <h4 className="text-xl font-black text-[#11181C] mb-2 tracking-tight">{v.name}</h4>
                                <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-8">{v.description}</p>
                                
                                {!isCompleted ? (
                                  <button className="w-full py-4 bg-[#F9FAFB] text-[#6B7280] text-xs font-black rounded-2xl hover:bg-[#11181C] hover:text-white transition-all uppercase tracking-[0.15em] border border-[#F3F4F6] hover:border-transparent">
                                    Mark Administered
                                  </button>
                                ) : (
                                  <div className="w-full py-4 bg-emerald-50 text-emerald-600 text-xs font-black rounded-2xl flex items-center justify-center gap-2 uppercase tracking-[0.15em] shadow-inner">
                                    <CheckCircle2 size={16} />
                                    Verified Record
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vaccines;
