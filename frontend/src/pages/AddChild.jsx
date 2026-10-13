import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { childrenAPI } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const AddChild = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await childrenAPI.create(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || 'Error creating child profile.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-lg mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a child</h1>
          <p className="text-sm text-gray-500">Create a profile to start tracking growth and health.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Child's name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Emma"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                name="gender"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChild;
