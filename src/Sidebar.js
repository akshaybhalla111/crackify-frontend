import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { jwtDecode } from 'jwt-decode';
import {
  Home, Video, Upload, History, Settings, HelpCircle, Brain, X, LogOut, UserCircle
} from 'lucide-react';
import { Button } from './components/ui/button';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-blue-200 shadow-2xl">
          <SidebarContent setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col justify-between overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-blue-200 px-6 pb-4 shadow-lg">
          <SidebarContent setSidebarOpen={setSidebarOpen} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

function SidebarContent({ setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const { subscriptionStatus } = useUI();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  let userEmail = 'Guest';
  if (auth) {
    try {
      const decoded = jwtDecode(auth);
      userEmail = decoded.sub || 'User';
    } catch (e) {
      console.error('JWT decoding failed');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mock Interview', href: '/mock-setup', icon: Brain },
    { name: 'Live Interview', href: '/live-setup', icon: Video },
    { name: 'Upload Resume', href: '/resume', icon: Upload },
    { name: 'Sessions', href: '/sessions', icon: History },
    { name: 'Support', href: '/support', icon: HelpCircle }
  ];

  return (
    <>
      {/* Logo */}
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <img
            src="/logo.jpg"
            alt="Crackify AI"
            className="h-14 w-14 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold text-blue-700">Crackify AI</span>
        </div>
        {setSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul className="-mx-2 space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`group flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 ${
                  location.pathname === item.href ? 'bg-blue-50 text-blue-700 shadow' : 'text-gray-700'
                }`}
              >
                <item.icon className="h-6 w-6 shrink-0 group-hover:text-blue-600 transition-colors duration-200" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Upgrade Card */}
        {/* Plan Status / Upgrade Logic */}
        <li className="mt-6">
          <div className="pt-6">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-xl text-center">
              <p className="text-sm font-semibold mb-1">{userEmail}</p>
              <p className="text-xs text-blue-100 mb-2">
                {subscriptionStatus
                  ? `${subscriptionStatus.charAt(0).toUpperCase()}${subscriptionStatus.slice(1)} Plan`
                  : 'Free Plan'}
              </p>

              {!subscriptionStatus || subscriptionStatus === 'free' ? (
                <Button
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm py-2"
                  onClick={() => navigate('/subscription')}
                >
                  Upgrade Now
                </Button>
              ) : (
                <div className="text-xs font-medium text-green-200 mt-2">
                  ✅ You’re on {subscriptionStatus.charAt(0).toUpperCase()}
                  {subscriptionStatus.slice(1)} Plan
                </div>
              )}
            </div>
          </div>
        </li>
      </nav>
    </>
  );
}
