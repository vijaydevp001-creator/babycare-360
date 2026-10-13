import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Users,
  Syringe,
  TrendingUp,
  CalendarDays,
  ClipboardList,
  Apple
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/children', label: 'Children', icon: Users },
    { path: '/growth', label: 'Growth', icon: TrendingUp },
    { path: '/vaccines', label: 'Vaccines', icon: Syringe },
    { path: '/appointments', label: 'Appointments', icon: CalendarDays },
    { path: '/nutrition', label: 'Nutrition', icon: Apple },
    { path: '/reports', label: 'Reports', icon: ClipboardList },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-[#11181C] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-lg shadow-gray-200">
              <span className="text-white font-black text-xl tracking-tighter">B</span>
            </div>
            <span className="text-xl font-bold text-[#11181C] tracking-tight">Baby 360</span>
          </Link>

          {/* Connected Page Links */}
          <div className="hidden xl:flex items-center gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-base font-bold transition-all duration-300 border border-transparent ${
                    isActive(link.path)
                      ? 'text-[#2563EB] bg-[#EFF6FF] border-[#DBEAFE]'
                      : 'text-[#6B7280] hover:text-[#11181C] hover:bg-[#F9FAFB] hover:border-[#F3F4F6]'
                  }`}
                >
                  <Icon size={18} strokeWidth={2.5} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-3">
                <button className="p-3 text-[#9CA3AF] hover:text-[#11181C] hover:bg-[#F9FAFB] rounded-2xl transition-all duration-300">
                  <Search size={20} strokeWidth={2.5} />
                </button>
                <button className="p-3 text-[#9CA3AF] hover:text-[#11181C] hover:bg-[#F9FAFB] rounded-2xl transition-all duration-300 relative group">
                  <Bell size={20} strokeWidth={2.5} />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#2563EB] rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="w-px h-8 bg-[#E5E7EB] mx-1 hidden sm:block" />

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-2xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#F3F4F6] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#11181C] flex items-center justify-center text-sm font-black text-white shadow-md shadow-gray-200">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-[#11181C] leading-none mb-1">{user?.name || 'User'}</p>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest leading-none">Settings</p>
                </div>
                <ChevronDown size={16} className="text-[#9CA3AF]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-4 py-3 border-b border-[#F3F4F6] mb-1">
                    <p className="text-sm font-bold text-[#11181C]">{user?.name}</p>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-0.5">{user?.role || 'Parent'}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#6B7280] hover:text-[#11181C] hover:bg-[#F9FAFB] transition-all">
                    <Users size={16} />
                    Manage Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all text-left"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
