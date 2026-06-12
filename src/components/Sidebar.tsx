import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Fingerprint,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  UserCheck,
  Building,
} from 'lucide-react';
import { UserProfile } from '../types';
import logoImage from '../assets/images/mej_sacred_logo_1781250804856.jpg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    {
      group: 'MAIN DASHBOARD',
      items: [
        { id: 'dashboard', label: 'Overview Hub', icon: LayoutDashboard },
        { id: 'pilgrims', label: 'Pilgrim Roster', icon: Users },
        { id: 'documents', label: 'Document Auditor', icon: FolderOpen },
      ],
    },
    {
      group: 'BIOMETRICS & VFS',
      items: [
        { id: 'biometrics', label: 'Biometric Calendar', icon: Fingerprint },
      ],
    },
    {
      group: 'VISA SYARIKAH & SPONSORS',
      items: [
        { id: 'visa-reports', label: 'Visa Reports', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0c0f1d] border-r border-slate-900 flex flex-col min-h-screen shrink-0 z-30 text-slate-400">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-900/60 flex items-center gap-3">
        <img
          src={logoImage}
          alt="MEJ SACRED Logo"
          className="w-10 h-10 rounded-xl object-cover shadow-lg border border-emerald-500/20"
          referrerPolicy="no-referrer"
        />
        <div>
          <h1 className="font-sans font-extrabold text-white text-sm tracking-widest uppercase leading-none">MEJ SACRED</h1>
          <p className="text-[9px] text-[#5569ff] font-extrabold uppercase tracking-widest leading-none mt-1.5">JOURNEY PORTAL</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin Profile Box */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#181d33] border border-slate-800 flex items-center justify-center text-white font-bold text-sm select-none shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || 'Admin Unit A'}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3 text-[#5569ff]" />
              <span className="text-[9px] font-extrabold text-[#5569ff] uppercase tracking-wider">{currentUser?.role || 'ADMINISTRATOR'}</span>
            </div>
          </div>
        </div>
        
        {/* Logout btn */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-350 transition-all border border-rose-900/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
