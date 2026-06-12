import React from 'react';
import { UserProfile, UserRole } from '../types';
import { Settings, Shield, RefreshCw, Database, Terminal, UserCheck, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  currentUser: UserProfile | null;
  onRoleChange: (newRole: UserRole) => void;
  onResetDatabase: () => void;
}

export default function SettingsView({
  currentUser,
  onRoleChange,
  onResetDatabase,
}: SettingsViewProps) {

  const handleReset = () => {
    if (confirm('Are you sure you want to restore the simulated Firestore to default demo records? This will clear custom registrations.')) {
      onResetDatabase();
      alert('Simulated Database Collections Reset Successfully!');
    }
  };

  return (
    <div className="max-w-3xl space-y-8 text-xs">
      {/* Configuration Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6">
        <header className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-950" />
            <h3 className="font-bold text-slate-950 uppercase tracking-wider">Portal Setting & Diagnostics</h3>
          </div>
          <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold text-slate-500">
            Node: MEJ_UNIT_A
          </span>
        </header>

        {/* Dynamic Role Switcher */}
        <section className="space-y-3">
          <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Administrative Authorization Control</span>
          <p className="text-slate-500 font-body-md leading-relaxed text-[11px]">
            Instantly switch profiles to observe how different roles view and submit pilgrim records.
          </p>

          <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-50 border rounded-xl">
            {(['Administrator', 'Admin', 'Supervisor'] as UserRole[]).map((role) => {
              const isSelected = currentUser?.role === role;
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`py-3 px-4 rounded-lg font-bold text-[11px] uppercase transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span>{role}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Reset Database */}
        <section className="border-t border-slate-100 pt-6 space-y-3">
          <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Simulated Database Maintenance</span>
          <p className="text-slate-500 font-body-md leading-relaxed text-[11px]">
            If you have deleted or added multiple custom items and wish to restore the original screenshot dataset, you can reset the LocalStorage mirrors instantly.
          </p>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database Mock Streams</span>
          </button>
        </section>
      </div>

      {/* Network diagnostics ledger details */}
      <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-4">
        <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
          <Terminal className="w-4 h-4" />
          SYSTEM_BOOT_LOGS
        </h3>

        <div className="font-mono text-[10.5px] text-emerald-100/90 leading-relaxed font-semibold space-y-1 bg-emerald-900/50 p-4 rounded-xl border border-emerald-800">
          <p className="flex justify-between">
            <span>[ONLINE] Firestone Realtime snap listeners:</span>
            <span className="text-emerald-400">SUCCESS</span>
          </p>
          <p className="flex justify-between">
            <span>[ONLINE] Firebase Auth security rule checkers:</span>
            <span className="text-emerald-400">BOUND_AND_SAFE</span>
          </p>
          <p className="flex justify-between">
            <span>[CLIENT] Tab synchronizer listener channels:</span>
            <span className="text-emerald-400">ACTIVE</span>
          </p>
          <p className="flex justify-between">
            <span>[VERSION] MEJ App Control Engine Version:</span>
            <span className="text-emerald-400">v2.4.0</span>
          </p>
        </div>

        <div className="flex gap-2 items-center text-[10.5px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All nodes responsive and synchronized perfectly.</span>
        </div>
      </div>
    </div>
  );
}
