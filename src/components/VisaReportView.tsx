import React, { useState } from 'react';
import { SyarikahReport, Pilgrim } from '../types';
import { FileText, Plus, ShieldCheck, ChevronRight, TrendingUp, Inbox, CheckCircle2, UserCheck, Shuffle, FileWarning } from 'lucide-react';
import { motion } from 'motion/react';

interface VisaReportViewProps {
  syarikahReports: SyarikahReport[];
  pilgrims: Pilgrim[];
  onAddSyarikahReport: (newReport: any) => void;
}

export default function VisaReportView({
  syarikahReports,
  pilgrims,
  onAddSyarikahReport,
}: VisaReportViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sponsorId: '',
    visaNo: '',
    qtyMale: 10,
    qtyFemale: 10,
    usedMale: 0,
    usedFemale: 0,
    sourcing: 'ABDULLAH',
  });

  const handleImportDemo = () => {
    // Generate simulated imported Syarikah records from report file upload
    const mockSyarikahs = [
      {
        name: "Syarikah Watad Al-Mab'us",
        sponsorId: "7052491045",
        visaNo: "1305701895",
        qtyMale: 85,
        qtyFemale: 85,
        usedMale: 30,
        usedFemale: 40,
        sourcing: "KHALID" as const
      },
      {
        name: "Syarikah Mona Eid Al-Awfi (Imported)",
        sponsorId: "9312214456",
        visaNo: "9002183201",
        qtyMale: 120,
        qtyFemale: 140,
        usedMale: 45,
        usedFemale: 35,
        sourcing: "HOSSAM" as const
      },
      {
        name: "Mousa Travel Group (Imported)",
        sponsorId: "4051189920",
        visaNo: "4110293022",
        qtyMale: 50,
        qtyFemale: 50,
        usedMale: 12,
        usedFemale: 15,
        sourcing: "ABDULLAH" as const
      }
    ];

    mockSyarikahs.forEach(r => {
      onAddSyarikahReport(r);
    });

    setImportNotice("Sukses: Diimpor 3 data alokasi syarikah baru dari dokumen visa reports!");
    setTimeout(() => setImportNotice(null), 5000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and parse CSV / text
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleImportDemo();
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sponsorId || !formData.visaNo) {
      alert('Sponsor Name, Sponsor ID, and Visa No are required!');
      return;
    }
    onAddSyarikahReport({
      ...formData,
      availMale: formData.qtyMale - formData.usedMale,
      availFemale: formData.qtyFemale - formData.usedFemale,
    });
    setFormData({
      name: '',
      sponsorId: '',
      visaNo: '',
      qtyMale: 10,
      qtyFemale: 10,
      usedMale: 0,
      usedFemale: 0,
      sourcing: 'ABDULLAH',
    });
    setShowAddForm(false);
  };

  // Carry-over tracking mock pipelines representing processing status
  const carryOverClients = [
    {
      id: 'co-13',
      name: 'Abdurrahman Jamil',
      passportCode: 'K8192809',
      sourceAgency: 'Syarikah Mona Eid Al-Awfi',
      reason: 'Biometrics relocated',
      targetGroup: 'Batch 2024-B - Hossam',
      status: 'Transfer Approved',
    },
    {
      id: 'co-14',
      name: 'Fatimah Az-Zahra',
      passportCode: 'M2910283',
      sourceAgency: 'Syarikah Amsha Fahad',
      reason: 'Photo review flagging',
      targetGroup: 'Batch 2024-C - VIP Premium',
      status: 'Pending Verification',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stat Block Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Allocated Slots</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {syarikahReports.reduce((acc, c) => acc + c.qtyMale + c.qtyFemale, 0)} Pax
            </span>
            <span className="text-indigo-600 text-xs font-bold uppercase">Amil Approved</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Active Utilized Slots</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {syarikahReports.reduce((acc, c) => acc + c.usedMale + c.usedFemale, 0)} Pax
            </span>
            <span className="text-indigo-600 text-xs font-extrabold">
              {Math.round(
                (syarikahReports.reduce((acc, c) => acc + c.usedMale + c.usedFemale, 0) /
                  (syarikahReports.reduce((acc, c) => acc + c.qtyMale + c.qtyFemale, 0) || 1)) *
                  100
              )}
              % Utilized
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Carry-Over pipelines</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{carryOverClients.length} Clients</span>
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
              Auditing
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Syarikah Listing */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6">
          <header className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Syarikah Allocation Breakdown</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Approved Visa Quotas & Sourcing Streams</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="allocation-excel-loader"
                type="file"
                accept=".csv, .xlsx, .json, .txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('allocation-excel-loader')?.click()}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-teal-500 shadow transition-all cursor-pointer"
                title="Impor file alokasi menteri (.csv, .xlsx, atau .json) otomatis"
              >
                <FileText className="w-4 h-4 text-teal-100" />
                <span>Import Quota Report</span>
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? 'Close Loader' : 'Register Syarikah'}</span>
              </button>
            </div>
          </header>

          {/* Import success notification banner */}
          {importNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-lg flex items-center justify-between gap-2 text-[11px] text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{importNotice}</span>
              </div>
              <button type="button" onClick={() => setImportNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">✕</button>
            </div>
          )}

          {/* Quick Register Inline Form */}
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="p-5 border border-slate-250 bg-slate-50/50 rounded-xl space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Syarikah (Sponsor) Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Watad Al Mab'us"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Sourcing Officer</label>
                  <select
                    value={formData.sourcing}
                    onChange={(e) => setFormData({ ...formData, sourcing: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                  >
                    <option value="ABDULLAH">ABDULLAH</option>
                    <option value="HOSSAM">HOSSAM</option>
                    <option value="KHALID">KHALID</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Sponsor ID No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7052491045"
                    value={formData.sponsorId}
                    onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Visa Reference ID No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1305701895"
                    value={formData.visaNo}
                    onChange={(e) => setFormData({ ...formData, visaNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Alloc Male Slots</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.qtyMale}
                    onChange={(e) => setFormData({ ...formData, qtyMale: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Alloc Female Slots</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.qtyFemale}
                    onChange={(e) => setFormData({ ...formData, qtyFemale: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Utilized Male</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.usedMale}
                    onChange={(e) => setFormData({ ...formData, usedMale: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-semibold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Utilized Female</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.usedFemale}
                    onChange={(e) => setFormData({ ...formData, usedFemale: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-semibold text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold shadow-sm transition-colors"
                >
                  Save to Database
                </button>
              </div>
            </motion.form>
          )}

          {/* Tables layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-3.5 px-4 rounded-l-lg">Sponsor / Syarikah Info</th>
                  <th>ID Records</th>
                  <th className="text-center">Allocation Slots</th>
                  <th className="text-center">Active Utilized</th>
                  <th className="text-center">Remaining Balance</th>
                  <th className="text-right px-4 rounded-r-lg">Sourcing officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {syarikahReports.map((r) => {
                  const cap = r.qtyMale + r.qtyFemale;
                  const use = r.usedMale + r.usedFemale;
                  const left = cap - use;
                  const percentLeft = Math.round((left / (cap || 1)) * 100);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                      <td className="py-4 px-4">
                        <span className="block font-bold text-slate-900">{r.name}</span>
                        <span className="text-[10px] text-slate-450 font-semibold font-mono">VISA REF: {r.visaNo}</span>
                      </td>

                      <td className="font-mono text-[#545f73] text-[10.5px]">SPONS_ID: {r.sponsorId}</td>

                      <td className="text-center">
                        <span className="font-bold text-slate-800">{cap}</span>
                        <p className="text-[9.5px] text-slate-400 mt-0.5">Male {r.qtyMale} • Female {r.qtyFemale}</p>
                      </td>

                      <td className="text-center text-indigo-600 font-extrabold">
                        <span>{use}</span>
                        <p className="text-[9.5px] text-slate-400 font-normal mt-0.5">Male {r.usedMale} • Female {r.usedFemale}</p>
                      </td>

                      <td className="text-center">
                        {/* Progress visual representation matching screens */}
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            percentLeft > 30 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-850'
                          }`}>
                            {left} Left ({percentLeft}%)
                          </span>
                        </div>
                      </td>

                      <td className="text-right px-4 font-bold text-slate-700">{r.sourcing}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Carry-Over Client pipeline */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <header className="pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-indigo-600" />
                Carry-Over Pipeline
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Relocations Audited by Ministry Of Hajj</p>
            </header>

            <div className="space-y-4.5">
              {carryOverClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{client.name}</h4>
                      <span className="font-mono text-[9px] text-slate-400 font-bold block mt-0.5">{client.passportCode}</span>
                    </div>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wide">
                      {client.status}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-slate-200/50 text-[10.5px] leading-relaxed">
                    <p className="text-slate-500 font-body-md">
                      Reason: <strong className="text-slate-800 font-medium">{client.reason}</strong>
                    </p>
                    <p className="text-slate-500 font-body-md">
                      Source Syarikah: <strong className="text-slate-900 font-bold uppercase">{client.sourceAgency}</strong>
                    </p>
                    <p className="text-slate-500 font-body-md">
                      Alloc Target: <strong className="text-indigo-600 font-extrabold">{client.targetGroup}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing warning */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex gap-2.5 mt-4">
            <FileWarning className="w-5 h-5 text-amber-800 shrink-0" />
            <div className="text-[10.5px] text-amber-950 font-body-md leading-relaxed">
              <p className="font-bold">Automated Re-sourcing Guard</p>
              <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                If slots left in Syarikah Mona drop below 10%, the portal auto-alerts Unit Lead to prevent downstream visa rejection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
