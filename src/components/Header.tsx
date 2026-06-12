import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, CheckCircle, Wifi, Database, X } from 'lucide-react';
import { Pilgrim } from '../types';

interface HeaderProps {
  activeTab: string;
  pilgrims: Pilgrim[];
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export default function Header({ activeTab, pilgrims, searchTerm: propsSearchTerm, onSearchChange }: HeaderProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displaySearchTerm = propsSearchTerm !== undefined ? propsSearchTerm : localSearchTerm;

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Hub';
      case 'pilgrims':
        return 'Pilgrim Roster';
      case 'documents':
        return 'Document Auditor';
      case 'biometrics':
        return 'Biometric Calendar';
      case 'visa-reports':
        return 'Visa Reports';
      default:
        return 'Sacred Journey';
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (propsSearchTerm !== undefined) {
      if (onSearchChange) {
        onSearchChange(value);
      }
    } else {
      setLocalSearchTerm(value);
      if (onSearchChange) {
        onSearchChange(value);
      }
    }
  };

  return (
    <header className="bg-white border-b border-[#eaebf2] px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
      {/* Search & Breadcrumb */}
      <div className="flex items-center gap-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">MEJ PORTAL / ADMIN</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{getTitle()}</h2>
        </div>

        {/* Global Instant Search */}
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={displaySearchTerm}
            onChange={handleSearch}
            placeholder="Search pilgrims, docs, visas..."
            className="w-64 pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-body-md"
          />
          {displaySearchTerm && (
            <button
              onClick={() => {
                if (propsSearchTerm !== undefined) {
                  onSearchChange?.('');
                } else {
                  setLocalSearchTerm('');
                  onSearchChange?.('');
                }
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sync Status, Time & Actions */}
      <div className="flex items-center gap-6">
        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2 bg-[#e4f6ed] text-[#0d7d4c] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#c3ebda] shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-[#0d7d4c] uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#0d7d4c]" />
            FIRESTORE LIVE
          </span>
        </div>

        {/* Realtime Time Display */}
        <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-slate-500">
          <span className="font-bold text-slate-700">Makkah Time (Sim)</span>
          <span>{systemTime.toLocaleTimeString()} UTC+3</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
