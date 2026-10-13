import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      login({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.msg ||
        error.response?.data?.error ||
        (!error.response
          ? 'Unable to reach the server. Ensure the backend and MongoDB are running.'
          : 'Registration failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2563EB] rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <span className="text-3xl font-black text-[#11181C] tracking-tight">Baby 360</span>
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-[#11181C] tracking-tight">Create your account</h2>
        <p className="mt-4 text-center text-base text-[#6B7280] font-medium leading-relaxed">
          Join Baby360 to start monitoring your child's health and nutrition with expert insights.
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-12 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-[40px] sm:px-12 border border-[#E5E7EB]">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-3 ml-1">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="appearance-none block w-full px-6 py-4.5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] placeholder-[#9CA3AF] text-[#11181C] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-base font-bold shadow-inner"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-3 ml-1">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="appearance-none block w-full px-6 py-4.5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] placeholder-[#9CA3AF] text-[#11181C] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-base font-bold shadow-inner"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-3 ml-1">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-6 py-4.5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] placeholder-[#9CA3AF] text-[#11181C] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-base font-bold shadow-inner pr-14"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-3 ml-1">
                I am a...
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  className="appearance-none block w-full px-6 py-4.5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-[#11181C] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-base font-bold shadow-inner cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="parent">Parent Tracking a Child</option>
                  <option value="doctor">Medical Professional</option>
                  <option value="school">School Administrator</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-4 p-5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-[24px]">
                <AlertCircle size={20} className="text-[#EF4444] mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-[#EF4444] leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-6 border border-transparent rounded-[24px] shadow-xl shadow-blue-200/50 text-lg font-black text-white bg-[#2563EB] hover:bg-[#1D4ED8] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Portfolio...' : 'Launch Health Profile'}
              </button>
            </div>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black">
                <span className="px-5 bg-white text-[#9CA3AF]">Privacy Shield Active</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-lg text-[#6B7280] font-bold">
          Already have an account?{' '}
          <Link to="/" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors inline-flex items-center gap-1 group">
            Sign in <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;