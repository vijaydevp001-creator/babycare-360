import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { childrenAPI, nutritionAPI } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import { 
  Loader2, Apple, Clock, Utensils, Plus, 
  ChevronRight, CheckCircle2, X, Info, 
  Leaf, Zap, Brain
} from 'lucide-react';

const Nutrition = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ 
    foodItem: '', 
    mealType: 'Breakfast',
    calories: '',
    notes: ''
  });
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
        fetchLogs(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (childId) => {
    setDataLoading(true);
    try {
      const res = await nutritionAPI.getByChild(childId);
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChildChange = (child) => {
    setSelectedChild(child);
    fetchLogs(child._id);
    setShowAddForm(false);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      await nutritionAPI.create({
        childId: selectedChild._id,
        ...addForm
      });
      setShowAddForm(false);
      setAddForm({ 
        foodItem: '', 
        mealType: 'Breakfast',
        calories: '',
        notes: ''
      });
      fetchLogs(selectedChild._id);
    } catch (error) {
      setAddError(error.response?.data?.msg || 'Failed to log meal.');
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
            <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-2">Nutrition Tracker</h1>
            <p className="text-base text-[#6B7280] font-medium max-w-2xl">
              Advanced precision monitoring of dietary intake and nutritional patterns for optimal health development.
            </p>
          </div>
          {selectedChild && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-3 bg-[#11181C] hover:bg-black text-white px-8 py-4 rounded-2xl text-base font-black transition-all shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {showAddForm ? <X size={22} strokeWidth={3} /> : <Plus size={22} strokeWidth={3} />}
              {showAddForm ? 'Cancel' : 'Log Meal Event'}
            </button>
          )}
        </div>

        {children.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#F9FAFB] border border-[#F3F4F6] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Apple size={40} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-2xl font-black text-[#11181C] mb-4">No dietary logs detected</h3>
            <p className="text-base text-[#6B7280] mb-12 max-w-sm mx-auto leading-relaxed font-medium">
              Initialize a child profile to activate the nutrition intelligence engine and dietary lifecycle tracking.
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
                <Brain size={40} className="text-emerald-500 mb-8 relative z-10" />
                <h4 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Nutrition Analysis</h4>
                <p className="text-sm text-[#9CA3AF] leading-relaxed font-bold relative z-10">
                  Precision synthesis of meal patterns to optimize balanced macronutrient distribution.
                </p>
                <div className="mt-10 pt-10 border-t border-white/10 space-y-5 relative z-10">
                   <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <Leaf size={18} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-200">Bio-Organic Tracking</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <Zap size={18} className="text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-200">Bio-Energy Levels</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-10">
              
              {showAddForm && (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-2xl font-black text-[#11181C] mb-10 tracking-tight">Log Clinical Meal Entry</h3>
                  <form onSubmit={handleAddLog} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Meal Category</label>
                        <select
                          className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all cursor-pointer shadow-inner appearance-none"
                          value={addForm.mealType}
                          onChange={(e) => setAddForm({ ...addForm, mealType: e.target.value })}
                        >
                          <option>Breakfast</option>
                          <option>Lunch</option>
                          <option>Dinner</option>
                          <option>Snack</option>
                        </select>
                      </div>
                      <div className="lg:col-span-1">
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Nutritional Items</label>
                        <input
                          type="text"
                          required
                          className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                          placeholder="What did they eat?"
                          value={addForm.foodItem}
                          onChange={(e) => setAddForm({ ...addForm, foodItem: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Energy (kcal)</label>
                        <input
                          type="number"
                          className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                          placeholder="e.g. 150"
                          value={addForm.calories}
                          onChange={(e) => setAddForm({ ...addForm, calories: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#F3F4F6]">
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
                        {addLoading ? <Loader2 size={24} className="animate-spin" /> : <Utensils size={24} />}
                        Save Dietary Log
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {dataLoading ? (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 flex flex-col items-center justify-center text-center shadow-sm">
                  <Loader2 size={40} className="animate-spin text-[#2563EB] mb-6" />
                  <p className="text-lg font-black text-[#11181C] tracking-tight">Syncing dietary history...</p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-10 ml-4">
                    <h3 className="text-2xl font-black text-[#11181C] tracking-tight">Integrated Dietary History</h3>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] bg-[#F9FAFB] px-4 py-1.5 rounded-xl border border-[#F3F4F6]">{logs.length} Entries Tracking</span>
                  </div>
                  
                  {logs.length === 0 ? (
                    <div className="py-20 text-center bg-[#F9FAFB] rounded-[32px] border-2 border-dashed border-[#E5E7EB] mx-4">
                      <p className="text-base font-black text-[#9CA3AF] uppercase tracking-widest tracking-tight">No Consumption Records Captured</p>
                      <p className="text-sm font-bold text-[#9CA3AF] mt-2">Log your first meal to start monitoring nutritional intake.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {logs.slice().reverse().map((log) => (
                        <div 
                          key={log._id} 
                          className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-[#F9FAFB] rounded-[36px] group hover:bg-white border-2 border-transparent hover:border-[#F3F4F6] transition-all gap-8 shadow-sm hover:shadow-2xl hover:shadow-gray-100/50"
                        >
                          <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center border-2 border-[#F3F4F6] group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0">
                              <Utensils size={32} strokeWidth={2.5} className="text-emerald-500" />
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 ml-1">{log.mealType}</p>
                               <h4 className="text-2xl font-black text-[#11181C] mb-3 tracking-tight">{log.foodItem || 'Biological Nourishment'}</h4>
                               <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#6B7280]">
                                    <Clock size={18} className="text-[#9CA3AF]" />
                                    {new Date(log.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  {log.calories && (
                                    <>
                                      <div className="w-1.5 h-1.5 bg-[#E5E7EB] rounded-full hidden md:block" />
                                      <div className="flex items-center gap-2.5 text-sm font-bold text-[#6B7280]">
                                        <Zap size={18} className="text-blue-500" />
                                        {log.calories} kcal tracking
                                      </div>
                                    </>
                                  )}
                               </div>
                            </div>
                          </div>
                          <ChevronRight size={24} className="text-[#E5E7EB] group-hover:text-[#2563EB] transition-all group-hover:translate-x-1.5 hidden md:block" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Nutrition;
