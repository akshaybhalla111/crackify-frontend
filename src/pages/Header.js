// src/pages/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar } from '../components/ui/avatar';
import { useAuth } from '../AuthContext';

export default function Header({ setSidebarOpen }) {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  let userName = 'User';
  let userEmail = '';
  if (auth) {
    try {
      const decoded = JSON.parse(atob(auth.split('.')[1]));
      userEmail = decoded.sub || '';
      userName = userEmail.split('@')[0] || 'User';
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-blue-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Mobile menu + Home label */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {
                console.log("clicked");
                setSidebarOpen(true);
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-lg font-semibold text-gray-700 hidden sm:block">Home</div>
          </div>

          {/* Right side: Avatar */}
          <div className="flex items-center gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 ring-1 ring-blue-200 hover:ring-blue-400">
                    <span className="text-white font-semibold text-sm bg-gradient-to-br from-blue-500 to-purple-600 h-full w-full flex items-center justify-center rounded-full">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
