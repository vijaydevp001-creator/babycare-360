import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { childrenAPI, growthAPI } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import GrowthChart from '../components/GrowthChart.jsx';
import { 
  Loader2, TrendingUp, ChevronRight, Plus, 
  Scale, Ruler, Calendar, AlertCircle, CheckCircle2,
  X
} from 'lucide-react';

const Growth = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ weight: '', height: '', date: new Date().toISOString().split('T')[0] });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await childrenAPI.getAll();
      setChildren(res.data);
      if (res.data.length > 0) {
        setSelectedChild(res.data[0]);
        fetchGrowthData(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrowthData = async (childId) => {
    setDataLoading(true);
    try {
      const res = await growthAPI.getByChild(childId);
      setGrowthData(res.data);
    } catch (error) {
      console.error('Error fetching growth records:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChildChange = (child) => {
    setSelectedChild(child);
    fetchGrowthData(child._id);
    setShowAddForm(false);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      await growthAPI.create({
        childId: selectedChild._id,
        ...addForm
      });
      setShowAddForm(false);
      setAddForm({ weight: '', height: '', date: new Date().toISOString().split('T')[0] });
      fetchGrowthData(selectedChild._id);
    } catch (error) {
      setAddError(error.response?.data?.msg || 'Failed to add record.');
    }
    setAddLoading(false);
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
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14">
          <div>
            <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-2">Growth Intelligence</h1>
            <p className="text-base text-[#6B7280] font-medium max-w-2xl">
              Advanced precision analytics for monitoring physical development markers and clinical growth trajectories.
            </p>
          </div>
          {selectedChild && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-3 bg-[#11181C] hover:bg-black text-white px-8 py-4 rounded-2xl text-base font-black transition-all shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {showAddForm ? <X size={22} strokeWidth={3} /> : <Plus size={22} strokeWidth={3} />}
              {showAddForm ? 'Cancel' : 'Add Measurement'}
            </button>
          )}
        </div>

        {children.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#F9FAFB] border border-[#F3F4F6] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <TrendingUp size={40} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-2xl font-black text-[#11181C] mb-4">Zero Development Data</h3>
            <p className="text-base text-[#6B7280] mb-12 max-w-sm mx-auto leading-relaxed font-medium">
              Establish a clinical profile and record initial measurements to activate the growth intelligence engine.
            </p>
            <Link to="/children" className="inline-flex items-center gap-3 bg-[#11181C] text-white px-10 py-5 rounded-2xl text-base font-black hover:bg-black transition-all shadow-2xl shadow-gray-200/50">
              Go to Profiles Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Selector */}
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
                <h4 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Growth Logic</h4>
                <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed font-bold relative z-10">
                  Consistent data synthesis enables early detection of clinical developmental shifts.
                </p>
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="w-10 h-10 bg-[#2563EB]/20 rounded-xl flex items-center justify-center border border-[#2563EB]/30">
                      <Scale size={18} className="text-[#2563EB]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-200">Weight metrics</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                      <Ruler size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-200">Height metrics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-10">
              
              {showAddForm && (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-2xl font-black text-[#11181C] mb-10 tracking-tight text-center md:text-left">Clinical Measurement Update</h3>
                  <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                        placeholder="0.00"
                        value={addForm.weight}
                        onChange={(e) => setAddForm({ ...addForm, weight: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Height (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                        placeholder="0.0"
                        value={addForm.height}
                        onChange={(e) => setAddForm({ ...addForm, height: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Date Recorded</label>
                      <input
                        type="date"
                        required
                        className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                        value={addForm.date}
                        onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#F3F4F6]">
                       {addError && (
                         <div className="flex items-center gap-3 bg-rose-50 px-4 py-2 rounded-xl text-rose-500 font-bold text-sm">
                           <AlertCircle size={18} />
                           {addError}
                         </div>
                       )}
                       <button
                        type="submit"
                        disabled={addLoading}
                        className="w-full md:w-auto bg-[#11181C] text-white px-12 py-5 rounded-[24px] text-lg font-black hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 active:scale-[0.97] ml-auto"
                      >
                        {addLoading ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                        Save Lifecycle Update
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {dataLoading ? (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 flex flex-col items-center justify-center text-center shadow-sm">
                  <Loader2 size={40} className="animate-spin text-[#2563EB] mb-6" />
                  <p className="text-lg font-black text-[#11181C] tracking-tight">Syncing growth markers...</p>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <GrowthChart data={growthData} type="weight" />
                    <GrowthChart data={growthData} type="height" />
                  </div>

                  {/* History List */}
                  <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10 ml-4">
                      <h3 className="text-2xl font-black text-[#11181C] tracking-tight">Clinical Record Log</h3>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] bg-[#F9FAFB] px-4 py-1.5 rounded-xl border border-[#F3F4F6]">
                        {growthData.length} Measurements
                      </span>
                    </div>
                    
                    {growthData.length === 0 ? (
                      <div className="py-20 text-center bg-[#F9FAFB] rounded-[32px] border-2 border-dashed border-[#E5E7EB] mx-4">
                        <p className="text-base font-black text-[#9CA3AF] uppercase tracking-widest tracking-tight">No Historical Logs Found</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {growthData.slice().reverse().map((record, i) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-[#F9FAFB] rounded-[32px] group hover:bg-white border-2 border-transparent hover:border-[#F3F4F6] transition-all gap-8 hover:shadow-2xl hover:shadow-gray-100/50">
                            <div className="flex items-center gap-8">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-[#F3F4F6] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <Calendar size={28} strokeWidth={2.5} className="text-[#6B7280]" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2 ml-1">
                                  {new Date(record.date || record.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                      <Scale size={16} className="text-blue-500" />
                                    </div>
                                    <span className="text-xl font-black text-[#11181C] tracking-tight">{record.weight}<span className="text-xs ml-1 text-[#6B7280]">kg</span></span>
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-[#E5E7EB] rounded-full hidden md:block" />
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                      <Ruler size={16} className="text-emerald-500" />
                                    </div>
                                    <span className="text-xl font-black text-[#11181C] tracking-tight">{record.height}<span className="text-xs ml-1 text-[#6B7280]">cm</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={24} className="text-[#E5E7EB] group-hover:text-[#2563EB] transition-all group-hover:translate-x-1.5 hidden md:block" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Growth;
