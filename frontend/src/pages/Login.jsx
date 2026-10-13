import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { auth, provider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token
      });
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg ||
        error.response?.data?.error ||
        (!error.response
          ? 'Unable to reach the server. Ensure the backend and MongoDB are running.'
          : 'Incorrect email or password.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      login({
        _id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        role: 'parent',
        token
      });

      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error.message);
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
        <h2 className="text-center text-4xl font-black text-[#11181C] tracking-tight">Sign in to Baby360</h2>
        <p className="mt-4 text-center text-base text-[#6B7280] font-medium leading-relaxed">
          The central hub for your child's medical and developmental journey.
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-12 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-[40px] sm:px-12 border border-[#E5E7EB]">
          <form className="space-y-8" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between mb-3 ml-1">
                <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors underline-offset-4 hover:underline">
                    Forgot?
                  </a>
                </div>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-6 py-4.5 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] placeholder-[#9CA3AF] text-[#11181C] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all text-base font-bold shadow-inner pr-14"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="flex items-center ml-1">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-5 w-5 text-[#2563EB] focus:ring-[#2563EB] border-[#E5E7EB] rounded-lg transition-all cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember_me" className="ml-3 block text-base text-[#6B7280] font-bold cursor-pointer">
                Trust this device
              </label>
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
                {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black">
                <span className="px-5 bg-white text-[#9CA3AF]">External Access</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                className="w-full inline-flex justify-center py-5 px-6 rounded-[24px] border-2 border-[#E5E7EB] bg-white text-base font-bold text-[#11181C] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all shadow-sm group"
              >
                <svg className="w-6 h-6 mr-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-lg text-[#6B7280] font-bold">
          New to Baby360?{' '}
          <Link to="/register" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors inline-flex items-center gap-1 group">
            Create account <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;