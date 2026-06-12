import React, { useState } from 'react';
import { Pilgrim } from '../types';
import { Calendar as CalendarIcon, UserCheck, Clock, Check, HelpCircle, ArrowRight, UserMinus, Plus, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

interface BiometricVFSViewProps {
  pilgrims: Pilgrim[];
  onUpdatePilgrim: (id: string, updates: any) => void;
}

export default function BiometricVFSView({ pilgrims, onUpdatePilgrim }: BiometricVFSViewProps) {
  // Calendar focuses on October 2024
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-08');
  const [reschedulePilgrimId, setReschedulePilgrimId] = useState<string | null>(null);
  const [newReschedTime, setNewReschedTime] = useState<'Morning' | 'Afternoon'>('Morning');
  const [newReschedDate, setNewReschedDate] = useState<string>('2024-10-08');

  // Days in October 2024: October 2024 starts on Tuesday (1st)
  // Grid layout helper: 31 days.
  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptyPreDays = Array.from({ length: 2 }, () => null); // Oct 1st is Tuesday

  // Batch allocations mock stats for rendering inline calendar indicators
  const getBatchIndicator = (day: number) => {
    const formatted = `2024-10-${day.toString().padStart(2, '0')}`;
    const assigned = pilgrims.filter((p) => p.preferredDate === formatted);
    if (assigned.length > 0) {
      const checkedIn = assigned.filter((p) => p.quotaStatus === 'ready').length; // ready is checked in / fully confirmed
      return {
        hasSchedules: true,
        count: assigned.length,
        checkedInCount: checkedIn,
      };
    }
    return null;
  };

  const handleAttendanceToggle = (pId: string, currentStatus: 'ready' | 'pending') => {
    const nextStatus = currentStatus === 'ready' ? 'pending' : 'ready';
    onUpdatePilgrim(pId, { quotaStatus: nextStatus });
  };

  const commitReschedule = (pId: string) => {
    onUpdatePilgrim(pId, {
      preferredDate: newReschedDate,
      preferredTime: newReschedTime,
    });
    setReschedulePilgrimId(null);
  };

  // Find active roster for selected date
  const activePilgrimsForDate = pilgrims.filter((p) => p.preferredDate === selectedDate);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Gregorian October 2024 Schedule Map */}
      <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-[#eaebf2] flex flex-col justify-between">
        <div>
          <header className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Enrollment Roadmap</span>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">October 2024 Appointments Calendar</h3>
            </div>
            <div className="text-right text-xs text-slate-500 font-semibold uppercase">
              VFS Tasheel Office Map
            </div>
          </header>

          {/* Days of Week header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* October Calendar Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {emptyPreDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 rounded-xl"></div>
            ))}

            {daysInOctober.map((day) => {
              const formattedDate = `2024-10-${day.toString().padStart(2, '0')}`;
              const isSelected = selectedDate === formattedDate;
              const indicator = getBatchIndicator(day);

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(formattedDate)}
                  className={`aspect-square p-2 rounded-xl transition-all border flex flex-col justify-between text-left items-start ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`text-[11px] font-bold font-mono h-6 w-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-indigo-500 text-white' : 'text-slate-800'
                  }`}>
                    {day}
                  </span>

                  {/* Operational capacity warning indicator dots */}
                  {indicator && (
                    <div className="w-full flex items-center justify-between mt-1">
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                        isSelected ? 'bg-indigo-500 text-indigo-100' : 'bg-indigo-50 text-indigo-950'
                      }`}>
                        {indicator.count} pAx
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        indicator.checkedInCount === indicator.count ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar legend / guide */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-4 text-[10px] text-slate-400 font-semibold uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            All Confirmed Hadir
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            Presence Pending
          </div>
        </div>
      </div>

      {/* Right Column: Live Attendance Sheet Synchronizer */}
      <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-[#eaebf2] flex flex-col justify-between min-h-[500px]">
        <div className="space-y-6">
          <header className="pb-4 border-b border-[#eaebf2]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Live VFS Batch Manifest</span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                Schedule: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded border border-indigo-100">
                {activePilgrimsForDate.length} pilgrims assigned
              </span>
            </div>
          </header>

          {/* Pilgrims List */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {activePilgrimsForDate.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Fingerprint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold">No biometric appointments today</p>
                <p className="mt-1 leading-relaxed text-[11px]">You can assign dates to any pilgrim in the Pilgrim Roster view to populate schedules.</p>
              </div>
            ) : (
              activePilgrimsForDate.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.fullName}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">{p.customId}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{p.passportNumber} • {p.preferredTime}</span>
                      </div>
                    </div>

                    {/* Operational attendance indicators */}
                    <button
                      onClick={() => handleAttendanceToggle(p.id, p.quotaStatus)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                        p.quotaStatus === 'ready'
                          ? 'bg-indigo-600 text-white border-indigo-750'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {p.quotaStatus === 'ready' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-indigo-200 stroke-[3]" />
                          Hadir (Checked-In)
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          Belum Hadir
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rescheduling Drawer Action nested in Card */}
                  {reschedulePilgrimId === p.id ? (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-3 mt-2">
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Reschedule Window</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block">Select Date</label>
                          <input
                            type="date"
                            value={newReschedDate}
                            onChange={(e) => setNewReschedDate(e.target.value)}
                            className="w-full p-1 border rounded text-[11px] bg-slate-50 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block">Select Slot</label>
                          <select
                            value={newReschedTime}
                            onChange={(e) => setNewReschedTime(e.target.value as 'Morning' | 'Afternoon')}
                            className="w-full p-1 border rounded text-[11px] bg-slate-50 font-semibold outline-none"
                          >
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1 px-1 pt-1">
                        <button
                          onClick={() => setReschedulePilgrimId(null)}
                          className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => commitReschedule(p.id)}
                          className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-indigo-700"
                        >
                          Commit Relocation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                      <span className="text-[10.5px] text-slate-400 font-semibold uppercase">{p.vfsCenter}</span>
                      <button
                        onClick={() => {
                          setReschedulePilgrimId(p.id);
                          setNewReschedDate(p.preferredDate);
                          setNewReschedTime(p.preferredTime);
                        }}
                        className="text-[10px] text-indigo-600 font-extrabold hover:underline inline-flex items-center gap-1 uppercase"
                      >
                        Reschedule VFS
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Device Sync Info Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[10.5px] text-slate-400 font-body-md leading-relaxed text-center">
          Tap <strong>Hadir (Checked-In)</strong> toggles to simulate biometric attendance desk scanner input.
        </div>
      </div>
    </div>
  );
}
