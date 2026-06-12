import React, { useState } from 'react';
import { Pilgrim, RecentActivity, SyarikahReport } from '../types';
import {
  Users,
  CheckCircle,
  FileCheck,
  Building,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  pilgrims: Pilgrim[];
  activities: RecentActivity[];
  syarikahReports: SyarikahReport[];
  onAddPilgrimBtnClick: () => void;
  onQuickSyarikahAdd: (newReport: any) => void;
}

export default function DashboardView({
  pilgrims,
  activities,
  syarikahReports,
  onAddPilgrimBtnClick,
  onQuickSyarikahAdd,
}: DashboardViewProps) {
  const [showAddSyarikahModal, setShowAddSyarikahModal] = useState(false);
  const [newSyarikah, setNewSyarikah] = useState({
    name: 'Syarikah Rawafed',
    sponsorId: '7028192801',
    visaNo: '1306019283',
    qtyMale: 10,
    qtyFemale: 10,
    sourcing: 'ABDULLAH',
  });

  // Calculate stats dynamically
  const totalPilgrims = pilgrims.length;

  const getDaysUntilExpiry = (expiryDateStr?: string) => {
    if (!expiryDateStr) return null;
    const today = new Date('2026-06-12T00:00:00');
    const expiry = new Date(expiryDateStr + 'T00:00:00');
    const diffTime = expiry.getTime() - today.getTime();
    if (isNaN(diffTime)) return null;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiringPilgrims = pilgrims.filter(p => {
    if (!p.visaExpiryDate) return false;
    const daysLeft = getDaysUntilExpiry(p.visaExpiryDate);
    return daysLeft !== null && daysLeft >= 0 && daysLeft <= 30;
  });

  const docCentPercent = Math.round(
    (pilgrims.filter(
      (p) =>
        p.ktpStatus === 'Uploaded' &&
        p.passportStatus === 'Uploaded' &&
        p.photoStatus === 'Uploaded' &&
        p.kkStatus === 'Uploaded'
    ).length /
      (totalPilgrims || 1)) *
      100
  );

  const visaStampedCount = pilgrims.filter((p) => p.visaStatus === 'Stamped').length;
  const visaProgressPercent = Math.round((visaStampedCount / (totalPilgrims || 1)) * 100);

  // Total Syarikah capacity and utilization calculations
  const totalVisaSyarikahQuota = syarikahReports.reduce(
    (acc, curr) => acc + curr.qtyMale + curr.qtyFemale,
    0
  );
  const usedSyarikahQuota = syarikahReports.reduce(
    (acc, curr) => acc + curr.usedMale + curr.usedFemale,
    0
  );

  const handleSyarikahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSyarikahAdd({
      ...newSyarikah,
      usedMale: 0,
      usedFemale: 0,
      availMale: newSyarikah.qtyMale,
      availFemale: newSyarikah.qtyFemale,
    });
    setShowAddSyarikahModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-1 px-[5px] pb-1.5 pt-1.5 bg-[#f5f6fa] border-2 border-[#e2e4ed] rounded-[22px] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#101424] via-[#1a1f3a] to-[#101424] text-white p-8 rounded-[18px] border border-slate-900 shadow-sm">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 select-none opacity-[0.07] blur-[1px]">
            <Compass className="w-96 h-96 text-indigo-400" />
          </div>
          <div className="max-w-2xl relative z-10 space-y-2">
            <span className="bg-[#5569ff] px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm inline-block">
              Operational Dashboard
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white/95">Haji & Umrah Logistics Management Portal</h2>
            <p className="text-xs text-indigo-200/80 leading-relaxed font-body-md pr-12">
              Real-time biometric scheduling, OCR document audits, and Syarikah visa allocation metrics.
              All client modifications instantly synchronize across active admin nodes.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pilgrims Registered */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Active Pilgrims</span>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-sans">{totalPilgrims}</span>
              <span className="text-indigo-600 text-xs font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                Live Syncing
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-body-md">Managed under current admin workspace</p>
          </div>
        </div>

        {/* Documents Completed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Doc Completion</span>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-sans">{docCentPercent}%</span>
              <div className="flex-1 max-w-[80px] bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${docCentPercent}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-body-md">Upload progress for 4 mandatory documents</p>
          </div>
        </div>

        {/* Visa Stamped */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Visas Stamped</span>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-600 font-sans">{visaStampedCount}</span>
              <span className="text-slate-500 text-xs">/ {totalPilgrims} total</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-body-md">{visaProgressPercent}% completion rate</p>
          </div>
        </div>

        {/* Syarikah Quota Monitor */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaebf2] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Syarikah Quota</span>
            <div className="bg-amber-50 text-amber-900 p-2 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-sans">{totalVisaSyarikahQuota - usedSyarikahQuota}</span>
              <span className="text-amber-700 text-xs font-semibold">Left</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-body-md">{usedSyarikahQuota} used out of {totalVisaSyarikahQuota} allocated</p>
          </div>
        </div>
      </div>

      {/* Visa Expiry Warning Dashboard Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <header className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Visa Expiry Alert Board (30-Day Threshold)</h3>
          </div>
          <span className="bg-rose-50 text-rose-700 font-extrabold text-[10px] px-3 py-1 rounded border border-rose-200 uppercase">
            {expiringPilgrims.length} Warnings Active
          </span>
        </header>

        {expiringPilgrims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs">
            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-full mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <p className="font-bold">No imminent visa expirations found.</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-body-md">All active pilgrim credentials are valid beyond 30 days.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringPilgrims.map(p => {
              const daysLeft = getDaysUntilExpiry(p.visaExpiryDate);
              let severityColor = 'border-amber-200 bg-amber-50/40 text-amber-900';
              let badgeColor = 'bg-amber-100 text-amber-900';
              let textHex = 'text-amber-800';

              if (daysLeft !== null) {
                if (daysLeft < 12) {
                  severityColor = 'border-rose-200 bg-rose-50/30 text-rose-950 shadow-sm';
                  badgeColor = 'bg-rose-500 text-white animate-pulse';
                  textHex = 'text-rose-700';
                } else if (daysLeft < 20) {
                  severityColor = 'border-orange-200 bg-orange-50/40 text-orange-950';
                  badgeColor = 'bg-orange-600 text-white';
                  textHex = 'text-orange-700';
                }
              }

              return (
                <div key={p.id} className={`p-4 rounded-xl border transition-all hover:shadow-md flex flex-col justify-between ${severityColor}`}>
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">{p.customId}</span>
                        <h4 className="font-bold text-slate-900 text-xs mt-0.5">{p.fullName}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap leading-none ${badgeColor}`}>
                        {daysLeft} Days Left
                      </span>
                    </div>

                    <div className="text-[10px] space-y-1 font-body-md mt-2 text-slate-600 border-t border-slate-200/50 pt-2">
                      <p>Passport: <strong className="font-mono text-slate-800 font-semibold">{p.passportNumber}</strong></p>
                      <p>Syarikah Group: <strong className="text-slate-800 font-medium truncate inline-block max-w-[150px] align-bottom">{p.visaBatch}</strong></p>
                      <p>Expiry Date: <strong className="text-slate-800 font-semibold">{p.visaExpiryDate}</strong></p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/40 pt-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Status: {p.visaStatus}
                    </span>
                    <span className={`text-[9px] font-extrabold font-mono tracking-tighter uppercase ${textHex}`}>
                      {daysLeft !== null && daysLeft <= 11 ? 'URGENT RENEWAL' : 'RENEWAL PLAN'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Timeline Log */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col max-h-[460px] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live System Sync Stream</h3>
            </div>
            <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-widest leading-none border border-indigo-100">
              Streaming
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No activity events recorded yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="relative pl-6 pb-2 border-l-2 border-slate-100 last:border-0">
                  <div className="absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-xs text-slate-800 leading-tight block">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Syarikah Summary Allocation Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Syarikah Visa Quota Monitoring
            </h3>
            <button
              onClick={() => setShowAddSyarikahModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import Quota</span>
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold">
                  <th className="py-2.5">Syarikah/Sponsor</th>
                  <th>Sponsor ID</th>
                  <th>Visa No / ID</th>
                  <th className="text-center">Allocation (M/F)</th>
                  <th className="text-center">Utilized (M/F)</th>
                  <th className="text-right">Available Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {syarikahReports.map((rep) => {
                  const totAlloc = rep.qtyMale + rep.qtyFemale;
                  const totUsed = rep.usedMale + rep.usedFemale;
                  const left = totAlloc - totUsed;
                  const percentLeft = Math.round((left / (totAlloc || 1)) * 100);

                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">{rep.name}</td>
                      <td>{rep.sponsorId}</td>
                      <td className="font-mono text-[10.5px] text-slate-400">{rep.visaNo}</td>
                      <td className="text-center">{rep.qtyMale}/{rep.qtyFemale}</td>
                      <td className="text-center text-indigo-600 font-bold">{rep.usedMale}/{rep.usedFemale}</td>
                      <td className="text-right font-semibold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            percentLeft > 30
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : percentLeft > 0
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {left} Available ({percentLeft}% )
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Quota Import Modal */}
      {showAddSyarikahModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
          >
            <div className="bg-slate-950 text-white p-6 border-b border-slate-800">
              <h3 className="font-bold text-sm uppercase tracking-wide">Import Syarikah Quota Allocation</h3>
              <p className="text-indigo-300 text-[10px] mt-1 font-body-md">
                Register authorized visa capacities and sponsor reference IDs instantly.
              </p>
            </div>
            <form onSubmit={handleSyarikahSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">STC / Sponsor Name</label>
                <input
                  type="text"
                  required
                  value={newSyarikah.name}
                  onChange={(e) => setNewSyarikah({ ...newSyarikah, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sponsor ID</label>
                  <input
                    type="text"
                    required
                    value={newSyarikah.sponsorId}
                    onChange={(e) => setNewSyarikah({ ...newSyarikah, sponsorId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Visa ID No</label>
                  <input
                    type="text"
                    required
                    value={newSyarikah.visaNo}
                    onChange={(e) => setNewSyarikah({ ...newSyarikah, visaNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qty Male Slots Required</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSyarikah.qtyMale}
                    onChange={(e) => setNewSyarikah({ ...newSyarikah, qtyMale: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qty Female Slots Required</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSyarikah.qtyFemale}
                    onChange={(e) => setNewSyarikah({ ...newSyarikah, qtyFemale: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Sourcing Officer</label>
                <select
                  value={newSyarikah.sourcing}
                  onChange={(e) => setNewSyarikah({ ...newSyarikah, sourcing: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ABDULLAH">ABDULLAH</option>
                  <option value="HOSSAM">HOSSAM</option>
                  <option value="KHALID">KHALID</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSyarikahModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow transition-colors"
                >
                  Commit to Firestore
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
