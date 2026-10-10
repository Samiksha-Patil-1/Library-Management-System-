import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, BookOpen, User, LogOut, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, overdueCount = 4, onOpenNotifications }) => {
  const { user, isLibrarian, switchDemoAccount, logout, setIsLoginModalOpen } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalog', label: 'Book Catalog' },
    { id: 'issue-book', label: 'Issue Book' },
    { id: 'student-portal', label: 'Student Portal' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F3D3E] text-white shadow-lg border-b border-[#1b5354]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Academic Cube & Book Logo Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#13494a] to-[#0A292A] rounded-xl border border-[#C5A25A]/50 shadow-md group-hover:border-[#C5A25A] transition-all">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#C5A25A]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h6" />
                <polygon points="12 2 16 6 12 10 8 6" fill="#C5A25A" opacity="0.4" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C5A25A] animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-[#C5A25A] uppercase leading-none">THE ACADEMIC</span>
              <span className="text-base font-extrabold tracking-wider text-white uppercase leading-tight font-serif">HUB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#165355]/40 rounded-lg'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-[#C5A25A] rounded-t-full shadow-[0_0_8px_#C5A25A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Overdue Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-[#165355] transition-colors cursor-pointer"
              title="Notifications & Overdue Alerts"
            >
              <Bell className="w-5 h-5" />
              {overdueCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {overdueCount}
                </span>
              )}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-[#165355]/60 transition-colors cursor-pointer focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] uppercase tracking-wider text-[#C5A25A] font-semibold leading-none">Profile</div>
                  <div className="text-sm font-semibold text-white leading-tight">{user ? user.name : 'Sign In'}</div>
                </div>

                <div className="relative w-9 h-9 rounded-full ring-2 ring-[#C5A25A]/60 overflow-hidden bg-[#165355] flex items-center justify-center">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Menu Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="text-xs text-slate-500 font-medium">Signed in as</div>
                    <div className="font-bold text-slate-900 text-sm">{user?.fullName || user?.name || 'Guest'}</div>
                    <div className="text-xs text-[#0F3D3E] font-medium mt-0.5 flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${isLibrarian ? 'bg-[#C5A25A]' : 'bg-emerald-500'}`} />
                      Role: <strong className="capitalize">{user?.role || 'Guest'}</strong>
                      {user?.student_id && <span className="text-slate-400">({user.student_id})</span>}
                    </div>
                  </div>

                  {/* Switch Role Quick Actions */}
                  <div className="px-3 py-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span>Quick Switch Mode</span>
                      <Sparkles className="w-3 h-3 text-[#C5A25A]" />
                    </div>

                    <button
                      onClick={() => {
                        switchDemoAccount('librarian');
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                        isLibrarian ? 'bg-[#0F3D3E]/10 text-[#0F3D3E] font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0F3D3E]" />
                        <span>Librarian (Sarah J.)</span>
                      </div>
                      {isLibrarian && <CheckCircle className="w-3.5 h-3.5 text-[#0F3D3E]" />}
                    </button>

                    <button
                      onClick={() => {
                        switchDemoAccount('student');
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer mt-1 ${
                        !isLibrarian ? 'bg-[#C5A25A]/20 text-[#8C6D2B] font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C5A25A]" />
                        <span>Student (Karie Berlinn - 22401)</span>
                      </div>
                      {!isLibrarian && <CheckCircle className="w-3.5 h-3.5 text-[#C5A25A]" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out / Switch User</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-[#165355] scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1 text-xs rounded-full ${
                  isActive ? 'bg-[#C5A25A] text-[#0F3D3E] font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
