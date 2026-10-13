import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { childrenAPI } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import {
  Users, Plus, ChevronRight, Loader2, X, AlertCircle, 
  Trash2, ShieldCheck, Calendar, Activity, Syringe, Stethoscope
} from 'lucide-react';

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', dateOfBirth: '', gender: 'male' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

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

  const handleAddChild = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      await childrenAPI.create(addForm);
      setShowAddModal(false);
      setAddForm({ name: '', dateOfBirth: '', gender: 'male' });
      fetchChildren();
    } catch (error) {
      setAddError(error.response?.data?.msg || 'Error creating child profile.');
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
            <h1 className="text-3xl font-black text-[#11181C] tracking-tight mb-2">Health Profiles</h1>
            <p className="text-base text-[#6B7280] font-medium">Digital healthcare environment for pediatric life tracking.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group inline-flex items-center justify-center gap-3 bg-[#11181C] hover:bg-black text-white px-8 py-4 rounded-2xl text-base font-black transition-all shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={22} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
            Add Child Profile
          </button>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[40px] p-24 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#F9FAFB] border border-[#F3F4F6] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Users size={40} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-2xl font-black text-[#11181C] mb-4">No active profiles</h3>
            <p className="text-base text-[#6B7280] mb-12 max-w-sm mx-auto leading-relaxed font-medium">
              Create a dedicated health portfolio to track developmental milestones, immunizations, and clinical nutrition.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-5 rounded-2xl text-base font-black transition-all shadow-2xl shadow-blue-200/50"
            >
              Register First Child
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {children.map((child) => (
              <div
                key={child._id}
                className="group bg-white border border-[#E5E7EB] rounded-[40px] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:border-[#2563EB]/20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F3F4F6] group-hover:bg-[#2563EB] transition-colors duration-500" />
                
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#F9FAFB] border-2 border-[#F3F4F6] flex items-center justify-center text-[#11181C] font-black text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {child.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#11181C] group-hover:text-[#2563EB] transition-colors mb-1.5">
                        {child.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[#9CA3AF] bg-[#F9FAFB] px-2 py-0.5 rounded-lg border border-[#F3F4F6]">{child.gender}</span>
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
                            {new Date(child.dateOfBirth).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-[#E5E7EB] group-hover:text-[#2563EB] group-hover:translate-x-1.5 transition-all duration-500 mt-2" />
                </div>

                <div className="grid grid-cols-3 gap-5 mb-10">
                  <div className="text-center p-4 bg-[#F9FAFB] rounded-3xl border-2 border-transparent group-hover:border-[#F3F4F6] transition-all group-hover:bg-white">
                    <Activity size={18} strokeWidth={2.5} className="mx-auto mb-3 text-blue-500" />
                    <p className="text-lg font-black text-[#11181C]">{child.growth_records?.length || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-black mt-1">Growth</p>
                  </div>
                  <div className="text-center p-4 bg-[#F9FAFB] rounded-3xl border-2 border-transparent group-hover:border-[#F3F4F6] transition-all group-hover:bg-white">
                    <Syringe size={18} strokeWidth={2.5} className="mx-auto mb-3 text-emerald-500" />
                    <p className="text-lg font-black text-[#11181C]">{child.vaccinations?.length || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-black mt-1">Vaccines</p>
                  </div>
                  <div className="text-center p-4 bg-[#F9FAFB] rounded-3xl border-2 border-transparent group-hover:border-[#F3F4F6] transition-all group-hover:bg-white">
                    <Stethoscope size={18} strokeWidth={2.5} className="mx-auto mb-3 text-purple-500" />
                    <p className="text-lg font-black text-[#11181C]">{child.appointments?.length || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-black mt-1">Visits</p>
                  </div>
                </div>

                <Link
                  to={`/children/${child._id}`}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#F9FAFB] text-[#6B7280] text-sm font-black rounded-2xl group-hover:bg-[#11181C] group-hover:text-white transition-all uppercase tracking-[0.1em] shadow-inner font-inter"
                >
                  Enter Portfolio
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── Add Child Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#11181C]/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-[#11181C] tracking-tight">Initialize Profile</h3>
                <p className="text-base font-bold text-[#9CA3AF] mt-2">Setup a unified digital health record.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-3 text-[#9CA3AF] hover:text-[#11181C] hover:bg-[#F9FAFB] rounded-2xl transition-all"
              >
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Internal Portfolio Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Johnson"
                  className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-3xl text-lg font-bold text-[#11181C] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-3xl text-lg font-bold text-[#11181C] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner"
                    value={addForm.dateOfBirth}
                    onChange={(e) => setAddForm({ ...addForm, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-3 ml-2">Gender Class</label>
                  <select
                    className="w-full px-6 py-5 bg-[#F9FAFB] border-2 border-transparent rounded-3xl text-lg font-bold text-[#11181C] focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all shadow-inner appearance-none cursor-pointer"
                    value={addForm.gender}
                    onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {addError && (
                <div className="flex items-start gap-4 p-6 bg-rose-50 border border-rose-100 rounded-3xl">
                  <AlertCircle size={24} className="text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-bold text-rose-500 leading-relaxed">{addError}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-full flex items-center justify-center gap-4 bg-[#11181C] hover:bg-black text-white py-6 rounded-3xl text-lg font-black transition-all shadow-2xl shadow-gray-200 active:scale-[0.97] disabled:opacity-50"
                >
                  {addLoading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                  {addLoading ? 'AUTHENTICATING...' : 'ESTABLISH HEALTH PROFILE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Children;
