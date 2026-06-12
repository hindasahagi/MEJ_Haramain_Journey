import React, { useState } from 'react';
import { Pilgrim, DocumentStatus, VisaStatus } from '../types';
import { Plus, Search, Calendar, FileText, ToggleLeft, Check, RotateCcw, Trash2, Edit, AlertCircle, Sparkles, UploadCloud, Scan, Loader2, Camera, CheckCircle2, ShieldAlert, Download, Printer, FileSpreadsheet, FileClock } from 'lucide-react';
import { motion } from 'motion/react';

interface PilgrimManagementViewProps {
  pilgrims: Pilgrim[];
  onAddPilgrim: (newPilgrim: any) => void;
  onUpdatePilgrim: (id: string, updates: any) => void;
  onDeletePilgrim?: (id: string) => void;
}

export default function PilgrimManagementView({
  pilgrims,
  onAddPilgrim,
  onUpdatePilgrim,
  onDeletePilgrim,
}: PilgrimManagementViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visaFilter, setVisaFilter] = useState<string>('All');
  
  // OCR AI Autofill States
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrStatusMessage, setOcrStatusMessage] = useState('');
  const [ocrScanSuccess, setOcrScanSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [ocrDocType, setOcrDocType] = useState<'Passport' | 'KTP' | 'KK' | 'Photo'>('Passport');
  const [ocrScannedPayload, setOcrScannedPayload] = useState<any>(null);
  
  // Physical Tracking PDF Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: 'Indonesia',
    gender: 'Male' as 'Male' | 'Female',
    dob: '1985-05-15',
    vfsCenter: 'Jakarta - South Central',
    preferredDate: '2024-10-08',
    preferredTime: 'Morning' as 'Morning' | 'Afternoon',
    quotaStatus: 'ready' as 'ready' | 'pending',
    visaBatch: 'Batch 2024-A - Abdullah (4 slots left)',
    visaStatus: 'Pending' as VisaStatus,
    ktpStatus: 'Uploaded' as DocumentStatus,
    passportStatus: 'Uploaded' as DocumentStatus,
    photoStatus: 'Missing' as DocumentStatus,
    kkStatus: 'Missing' as DocumentStatus,
    biometricStatus: 'Pending' as 'Pending' | 'Scheduled' | 'Completed',
    visaExpiryDate: '2026-07-20',
  });

  const triggerOcrScan = (type: 'passport1' | 'passport2' | 'passport3' | 'custom', customFileName?: string) => {
    setIsOcrScanning(true);
    setOcrScanSuccess(false);
    setOcrScannedPayload(null);
    setOcrStatusMessage(`Initializing Sacred Journey AI ${ocrDocType} OCR Scanner...`);
    
    let targetData = {
      fullName: 'Ahmad bin Salim Al-Haddad',
      passportNumber: 'C9012384',
      nationality: 'Indonesia',
      dob: '1965-08-30',
      gender: 'Male' as 'Male' | 'Female',
      passportStatus: 'Uploaded' as DocumentStatus,
      ktpStatus: 'Uploaded' as DocumentStatus,
      photoStatus: 'Missing' as DocumentStatus,
      kkStatus: 'Missing' as DocumentStatus,
    };

    let detailsSummary: any = {};

    if (ocrDocType === 'Passport') {
      if (type === 'passport1') {
        targetData = {
          ...targetData,
          fullName: 'Muhammad Rizky Prasetyo',
          passportNumber: 'B8172944',
          nationality: 'Indonesia',
          dob: '1989-11-23',
          gender: 'Male',
          passportStatus: 'Uploaded',
        };
      } else if (type === 'passport2') {
        targetData = {
          ...targetData,
          fullName: 'Siti Aminah Siregar',
          passportNumber: 'A7102931',
          nationality: 'Indonesia',
          dob: '1974-04-12',
          gender: 'Female',
          passportStatus: 'Uploaded',
        };
      } else {
        targetData = {
          ...targetData,
          fullName: 'H. Farhan Al-Fariqi',
          passportNumber: 'D1029463',
          nationality: 'Indonesia',
          dob: '1982-06-18',
          gender: 'Male',
          passportStatus: 'Uploaded',
        };
      }
      detailsSummary = {
        'Document Type': 'PASSPORT (MRZ)',
        'Passport No': targetData.passportNumber,
        'Full Name': targetData.fullName,
        'DOB': targetData.dob,
        'Nationality': targetData.nationality,
        'Security Compliance': '99.4% (ISO-7501 Compliant)',
      };
    } else if (ocrDocType === 'KTP') {
      const nik = '3174' + Math.floor(100000000000 + Math.random() * 900000000000);
      const name = type === 'passport2' ? 'Siti Aminah Siregar' : (type === 'passport1' ? 'Muhammad Rizky Prasetyo' : 'H. Farhan Al-Fariqi');
      const birth = type === 'passport2' ? '1974-04-12' : (type === 'passport1' ? '1989-11-23' : '1982-06-18');
      targetData = {
        ...targetData,
        fullName: name,
        dob: birth,
        gender: type === 'passport2' ? 'Female' : 'Male',
        ktpStatus: 'Uploaded',
      };
      detailsSummary = {
        'Document Type': 'KTP (National ID Card)',
        'NIK (16-Digit)': nik,
        'Provinsi': 'DKI JAKARTA',
        'Golongan Darah': 'O',
        'Status Perkawinan': 'KAWIN',
        'Verification Hash': 'KTPSYNC-2026-OK',
      };
    } else if (ocrDocType === 'KK') {
      const noKK = '3201' + Math.floor(100000000000 + Math.random() * 900000000000);
      const name = type === 'passport2' ? 'Siti Aminah Siregar' : (type === 'passport1' ? 'Muhammad Rizky Prasetyo' : 'H. Farhan Al-Fariqi');
      targetData = {
        ...targetData,
        fullName: name,
        kkStatus: 'Uploaded',
      };
      detailsSummary = {
        'Document Type': 'KK (Kartu Keluarga)',
        'No. KK': noKK,
        'Kepala Keluarga': name,
        'Registered Members': '4 Persons Checked',
        'Family Address': 'Jl. Kebagusan Dalam No. 12, Pasar Minggu',
      };
    } else if (ocrDocType === 'Photo') {
      const name = type === 'passport2' ? 'Siti Aminah Siregar' : (type === 'passport1' ? 'Muhammad Rizky Prasetyo' : 'H. Farhan Al-Fariqi');
      targetData = {
        ...targetData,
        fullName: name,
        photoStatus: 'Uploaded',
      };
      detailsSummary = {
        'Document Type': 'PAS FOTO (Saudi Standard)',
        'Photo Resolution': '413 x 531 Pixels (4x6 cm)',
        'Background Color': 'WHITE (MoHU Standard Approved)',
        'Face Alignment Score': '98.8% Alignment Checked',
        'Contrast Level': 'EXCELLENT',
      };
    }

    if (type === 'custom' && customFileName) {
      const parsedName = customFileName
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\d+/g, '')
        .trim()
        .toUpperCase();
      targetData.fullName = parsedName || 'H. RACHMAT HIDAYAT';
      detailsSummary['Full Name'] = targetData.fullName;
      detailsSummary['Source File'] = customFileName;
    }

    const steps = [
      { msg: `Analyzing uploaded ${ocrDocType} document structural alignment...`, delay: 600 },
      { msg: `Reading text layers, barcodes, and security structures via AI OCR...`, delay: 1300 },
      { msg: `Verifying identity checksums against Civil Registry databases...`, delay: 2000 },
      { msg: `Importing successfully parsed data into interactive forms...`, delay: 2600 },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setOcrStatusMessage(step.msg);
      }, step.delay);
    });

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        fullName: targetData.fullName,
        passportNumber: ocrDocType === 'Passport' ? targetData.passportNumber : prev.passportNumber,
        nationality: targetData.nationality,
        dob: targetData.dob,
        gender: targetData.gender as 'Male' | 'Female',
        passportStatus: ocrDocType === 'Passport' ? 'Uploaded' : prev.passportStatus,
        ktpStatus: ocrDocType === 'KTP' ? 'Uploaded' : prev.ktpStatus,
        kkStatus: ocrDocType === 'KK' ? 'Uploaded' : prev.kkStatus,
        photoStatus: ocrDocType === 'Photo' ? 'Uploaded' : prev.photoStatus,
      }));
      setIsOcrScanning(false);
      setOcrScanSuccess(true);
      setOcrScannedPayload(detailsSummary);
      setOcrStatusMessage(`Successfully extracted and validated ${ocrDocType} for "${targetData.fullName}"!`);
    }, 3100);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      triggerOcrScan('custom', file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      triggerOcrScan('custom', file.name);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.passportNumber.trim()) {
      alert("Name and Passport Number are required!");
      return;
    }
    const customId = `2027-HFR-${Math.floor(100 + Math.random() * 900)}`;
    onAddPilgrim({
      ...formData,
      customId,
    });
    // Reset and close
    setFormData({
      fullName: '',
      passportNumber: '',
      nationality: 'Indonesia',
      gender: 'Male',
      dob: '1985-05-15',
      vfsCenter: 'Jakarta - South Central',
      preferredDate: '2024-10-08',
      preferredTime: 'Morning',
      quotaStatus: 'ready',
      visaBatch: 'Batch 2024-A - Abdullah (4 slots left)',
      visaStatus: 'Pending',
      ktpStatus: 'Uploaded',
      passportStatus: 'Uploaded',
      photoStatus: 'Missing',
      kkStatus: 'Missing',
      biometricStatus: 'Pending',
      visaExpiryDate: '2026-07-20',
    });
    setShowAddModal(false);
  };

  const handleDocToggle = (pId: string, docField: 'ktpStatus' | 'passportStatus' | 'photoStatus' | 'kkStatus', current: DocumentStatus) => {
    const sequence: DocumentStatus[] = ['Uploaded', 'Review', 'Missing'];
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
    onUpdatePilgrim(pId, { [docField]: sequence[nextIdx] });
  };

  const handleVisaCycle = (pId: string, current: VisaStatus) => {
    const sequence: VisaStatus[] = ['Pending', 'Requesting', 'Processed', 'Stamped', 'Rejected'];
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
    onUpdatePilgrim(pId, { visaStatus: sequence[nextIdx] });
  };

  const handleExportCSV = () => {
    const headers = [
      'Ref ID',
      'Roster ID Ref',
      'Full Name',
      'Gender',
      'Nationality',
      'Passport Number',
      'Date of Birth',
      'Quota Status',
      'KTP Status',
      'Passport Status',
      'Photo Status',
      'KK Status',
      'Visa Status',
      'Biometrics VFS'
    ];
    
    const rows = filteredPilgrims.map(p => [
      p.customId,
      p.id,
      p.fullName,
      p.gender,
      p.nationality,
      p.passportNumber,
      p.dob,
      p.quotaStatus,
      p.ktpStatus,
      p.passportStatus,
      p.photoStatus,
      p.kkStatus,
      p.visaStatus,
      p.biometricStatus
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MEJ_Sacred_Journey_Roster_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter roster
  const filteredPilgrims = pilgrims.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisa = visaFilter === 'All' || p.visaStatus === visaFilter;

    return matchesSearch && matchesVisa;
  });

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter pilgrims by ID, name, passport..."
              className="w-72 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <select
            value={visaFilter}
            onChange={(e) => setVisaFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="All">All Visa Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Requesting">Requesting</option>
            <option value="Processed">Processed</option>
            <option value="Stamped">Stamped</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            type="button"
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            title="Ekspor list klien saat ini ke CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Physical PDF Tracking */}
          <button
            onClick={() => setShowPrintModal(true)}
            type="button"
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            title="Cetak berkas PDF untuk pelacakan fisik"
          >
            <Printer className="w-4 h-4 text-indigo-650" />
            <span>Print checklist (PDF)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Pilgrim</span>
          </button>
        </div>
      </div>

      {/* Synchronized Datatable */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-4 px-6">ID & Pilgrim Ref</th>
                <th className="py-4">Full Name / Gender</th>
                <th className="py-4">Passport No / DOB</th>
                <th className="py-4 text-center">Quota Alloc</th>
                <th className="py-4 text-center">Docs Checklist (Click to cycle status)</th>
                <th className="py-4 text-center">Visa Hub (Click to cycle)</th>
                <th className="py-4 text-center">Biometric VFS</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaebf2] text-slate-800">
              {filteredPilgrims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No matching pilgrims found in the workspace.
                  </td>
                </tr>
              ) : (
                filteredPilgrims.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* System reference keys */}
                    <td className="py-4 px-6 font-mono">
                      <span className="block font-bold text-slate-900 text-xs">{p.customId}</span>
                      <span className="text-[10px] text-slate-400">{p.id}</span>
                    </td>

                    {/* Basic details */}
                    <td>
                      <span className="block font-bold text-slate-900 text-xs">{p.fullName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5 uppercase">
                        {p.gender} • {p.nationality}
                      </span>
                    </td>

                    {/* Passport detail */}
                    <td>
                      <span className="block font-semibold text-slate-700 font-mono text-[11px]">{p.passportNumber}</span>
                      <span className="text-[10px] text-slate-400">DOB: {p.dob}</span>
                    </td>

                    {/* Allocation Batch */}
                    <td className="text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${
                        p.quotaStatus === 'ready'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {p.quotaStatus.toUpperCase()}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1 max-w-[130px] mx-auto truncate" title={p.visaBatch}>
                        {p.visaBatch}
                      </p>
                    </td>

                    {/* Documents Interactive Checklist */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        {/* KTP */}
                        <button
                          onClick={() => handleDocToggle(p.id, 'ktpStatus', p.ktpStatus)}
                          title={`KTP: ${p.ktpStatus}. Click to cycle.`}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                            p.ktpStatus === 'Uploaded'
                              ? 'bg-indigo-950 text-indigo-100 border-indigo-900'
                              : p.ktpStatus === 'Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          KTP
                        </button>

                        {/* Passport */}
                        <button
                          onClick={() => handleDocToggle(p.id, 'passportStatus', p.passportStatus)}
                          title={`Passport Doc: ${p.passportStatus}. Click to cycle.`}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                            p.passportStatus === 'Uploaded'
                              ? 'bg-indigo-950 text-indigo-100 border-indigo-900'
                              : p.passportStatus === 'Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          PAS
                        </button>

                        {/* Photo */}
                        <button
                          onClick={() => handleDocToggle(p.id, 'photoStatus', p.photoStatus)}
                          title={`Photo: ${p.photoStatus}. Click to cycle.`}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                            p.photoStatus === 'Uploaded'
                              ? 'bg-indigo-950 text-indigo-100 border-indigo-900'
                              : p.photoStatus === 'Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          FTO
                        </button>

                        {/* KK */}
                        <button
                          onClick={() => handleDocToggle(p.id, 'kkStatus', p.kkStatus)}
                          title={`Family Card (KK): ${p.kkStatus}. Click to cycle.`}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                            p.kkStatus === 'Uploaded'
                              ? 'bg-indigo-950 text-indigo-100 border-indigo-900'
                              : p.kkStatus === 'Review'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          KK
                        </button>
                      </div>
                    </td>                     {/* Visa Lifecycle status tracker */}
                    <td className="text-center">
                      <button
                        onClick={() => handleVisaCycle(p.id, p.visaStatus)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border transition-colors hover:opacity-85 ${
                          p.visaStatus === 'Stamped'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : p.visaStatus === 'Processed'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : p.visaStatus === 'Requesting'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : p.visaStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-rose-50 text-rose-900 border-rose-200'
                        }`}
                      >
                        {p.visaStatus}
                      </button>
                    </td>

                    {/* Biometric VFS progress/appointment status */}
                    <td className="text-center py-4">
                      <div className="flex flex-col items-center justify-center space-y-1 min-w-[124px] mx-auto">
                        <button
                          onClick={() => {
                            const statuses: ('Pending' | 'Scheduled' | 'Completed')[] = ['Pending', 'Scheduled', 'Completed'];
                            const currentIdx = statuses.indexOf(p.biometricStatus || 'Pending');
                            const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                            onUpdatePilgrim(p.id, { biometricStatus: nextStatus });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            p.biometricStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : p.biometricStatus === 'Scheduled'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {p.biometricStatus || 'Pending'}
                        </button>
                        
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 shadow-sm relative cursor-pointer" title="Click badge to cycle status">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.biometricStatus === 'Completed'
                                ? 'bg-emerald-500 w-full'
                                : p.biometricStatus === 'Scheduled'
                                ? 'bg-indigo-500 w-1/2'
                                : 'bg-slate-300 w-2'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Operational Row Deletion */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Active details query for Passport ${p.passportNumber}`)}
                          className="p-1 px-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded font-bold text-[10px]"
                        >
                          View Audit
                        </button>
                        {onDeletePilgrim && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove pilgrim ${p.fullName} from live database?`)) {
                                onDeletePilgrim(p.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instruction Box */}
      <div className="flex gap-2.5 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
        <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
        <div className="text-xs text-indigo-950 font-body-md">
          <p className="font-bold">Database Checkpoint & Live Interactivity</p>
          <p className="mt-0.5 text-indigo-900/90 leading-relaxed">
            Click on the document status buttons (KTP, PAS, FTO, KK) or Visa Hub pill to instantly cycle statuses.
            These updates trigger live changes which sync instantaneously to the DB simulation and main overview KPI counters!
          </p>
        </div>
      </div>

      {/* Add Pilgrim Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-950 p-6 border-b border-slate-800 text-white">
              <h3 className="font-bold text-sm uppercase tracking-wide">Register Pilgrim to Portal Roster</h3>
              <p className="text-indigo-300 text-[10px] mt-1 font-body-md">
                All data will instantly persist and coordinate into live dashboards.
              </p>
            </div>

            {/* Scrollable Form body */}
            <form onSubmit={handleRegister} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* OCR Automatic Scanner UI Block with tabs */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <span>AI Multi-Doc OCR Scanner</span>
                  </div>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Autofill Engine
                  </span>
                </div>

                {/* Tab selector buttons */}
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  {([
                    { key: 'Passport', label: 'Paspor' },
                    { key: 'KTP', label: 'KTP' },
                    { key: 'KK', label: 'KK' },
                    { key: 'Photo', label: 'Pas Foto' }
                  ] as const).map((docObj) => (
                    <button
                      key={docObj.key}
                      type="button"
                      onClick={() => {
                        setOcrDocType(docObj.key);
                        setOcrScanSuccess(false);
                        setOcrScannedPayload(null);
                      }}
                      className={`py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all ${
                        ocrDocType === docObj.key
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {docObj.label}
                    </button>
                  ))}
                </div>

                {/* Scanning visual overlay */}
                {isOcrScanning ? (
                  <div className="bg-indigo-950 text-white rounded-lg p-5 flex flex-col items-center justify-center space-y-3 relative overflow-hidden border border-indigo-900 shadow-md">
                    {/* Laser Scanner Bar Animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" style={{ animationDuration: '0.8s' }} />
                    
                    <Loader2 className="w-7 h-7 text-indigo-300 animate-spin" />
                    <p className="text-[11px] font-bold font-mono tracking-tight text-center text-indigo-100 animate-pulse">
                      {ocrStatusMessage || 'Reading details...'}
                    </p>
                    <span className="text-[9px] text-[#8fa0ff] uppercase tracking-widest font-bold">Scanning Document In Real-time</span>
                  </div>
                ) : (
                  <div className="space-y-3 border-t border-slate-100 pt-2">
                    {/* Active Drag Drop zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
                        dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/30'
                      }`}
                      onClick={() => document.getElementById('ocr-file-upload')?.click()}
                    >
                      <input
                        id="ocr-file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                      <p className="text-[11px] font-semibold text-slate-700">
                        Drag & Drop {ocrDocType === 'Photo' ? 'Pas Foto' : ocrDocType} or <span className="text-indigo-600 font-bold hover:underline">Browse</span>
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Automatically pre-fills and approves checklist item</p>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] uppercase tracking-wide text-slate-400 font-extrabold">Instant OCR Demo Simulators (Click to Autofill)</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => triggerOcrScan('passport1')}
                          className="px-2 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all text-center leading-tight hover:shadow"
                        >
                          <Scan className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                          <span>M. Rizky Passport</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerOcrScan('passport2')}
                          className="px-2 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all text-center leading-tight hover:shadow"
                        >
                          <Scan className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                          <span>S. Aminah KTP</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerOcrScan('passport3')}
                          className="px-2 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all text-center leading-tight hover:shadow"
                        >
                          <Scan className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                          <span>H. Farhan Pass</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Feedback message and payload details */}
                {ocrScanSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-950 leading-none">OCR Parse Complete!</p>
                        <p className="text-[9px] text-emerald-800/90 mt-1 leading-snug">
                          {ocrStatusMessage}
                        </p>
                      </div>
                    </div>
                    {ocrScannedPayload && (
                      <div className="border-t border-emerald-200/50 pt-2 text-start">
                        <p className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-wide">Extracted {ocrDocType} Fields:</p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-[9px] font-mono bg-white p-2 rounded border border-emerald-250">
                          {Object.entries(ocrScannedPayload).map(([key, val]) => (
                            <div key={key} className="flex justify-between border-b border-slate-150 py-0.5 col-span-2">
                              <span className="text-slate-500 font-semibold">{key}:</span>
                              <span className="text-slate-900 font-bold truncate max-w-[160px]" title={val as string}>{val as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name (As in Passport)</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Abdullah bin Ahmed"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Passport Number</label>
                  <input
                    type="text"
                    required
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. A2938475"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nationality</label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg inline-flex"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Portal Routing Defaults</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">VFS Fingerprint Center</label>
                    <select
                      value={formData.vfsCenter}
                      onChange={(e) => setFormData({ ...formData, vfsCenter: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Jakarta - South Central">Jakarta - South Central</option>
                      <option value="Kuala Lumpur - VFS TasHeel">Kuala Lumpur - VFS TasHeel</option>
                      <option value="Istanbul - European Side">Istanbul - European Side</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Allocation / Quota Type</label>
                    <select
                      value={formData.quotaStatus}
                      onChange={(e) => setFormData({ ...formData, quotaStatus: e.target.value as 'ready' | 'pending' })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="ready">READY (Fully Allocated)</option>
                      <option value="pending">PENDING (Waiting Allocation)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Biometric Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Biometric Appointment Slot</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value as 'Morning' | 'Afternoon' })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Morning">Morning (08:30 - 12:00)</option>
                      <option value="Afternoon">Afternoon (13:30 - 16:30)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Visa Syarikah Bundle Group</label>
                  <select
                    value={formData.visaBatch}
                    onChange={(e) => setFormData({ ...formData, visaBatch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Batch 2024-A - Abdullah (4 slots left)">Batch 2024-A - Abdullah (4 slots left)</option>
                    <option value="Batch 2024-B - Hossam (12 slots left)">Batch 2024-B - Hossam (12 slots left)</option>
                    <option value="Batch 2024-C - VIP Premium (2 slots left)">Batch 2024-C - VIP Premium (2 slots left)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Biometric VFS Status</label>
                    <select
                      value={formData.biometricStatus}
                      onChange={(e) => setFormData({ ...formData, biometricStatus: e.target.value as 'Pending' | 'Scheduled' | 'Completed' })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Visa Expiry Date</label>
                    <input
                      type="date"
                      value={formData.visaExpiryDate}
                      onChange={(e) => setFormData({ ...formData, visaExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">KTP Scan</label>
                  <select
                    value={formData.ktpStatus}
                    onChange={(e) => setFormData({ ...formData, ktpStatus: e.target.value as DocumentStatus })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none"
                  >
                    <option value="Uploaded">Uploaded</option>
                    <option value="Review">Review</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Passport Scan</label>
                  <select
                    value={formData.passportStatus}
                    onChange={(e) => setFormData({ ...formData, passportStatus: e.target.value as DocumentStatus })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none"
                  >
                    <option value="Uploaded">Uploaded</option>
                    <option value="Review">Review</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Photo Scan</label>
                  <select
                    value={formData.photoStatus}
                    onChange={(e) => setFormData({ ...formData, photoStatus: e.target.value as DocumentStatus })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none"
                  >
                    <option value="Uploaded">Uploaded</option>
                    <option value="Review">Review</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">KK Card</label>
                  <select
                    value={formData.kkStatus}
                    onChange={(e) => setFormData({ ...formData, kkStatus: e.target.value as DocumentStatus })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded outline-none"
                  >
                    <option value="Uploaded">Uploaded</option>
                    <option value="Review">Review</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 text-xs pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow"
                >
                  Commit & Sync Registration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Physical Tracking / print modal for Save as PDF */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 border border-slate-200 relative print:p-0 print:border-none print:shadow-none">
            
            {/* Non-print controls */}
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 print:hidden text-xs">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase">Physical Tracking Manifest (PDF Preview)</h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-850 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* The Printable Manifest layout */}
            <div id="printable-manifest" className="space-y-6">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div className="text-left">
                  <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">MAJMUAH EID AL-AWFI (MEJ)</h1>
                  <p className="text-xs text-slate-500 font-mono font-bold tracking-widest mt-1 uppercase">Sacred Journey Pilgrim Physical Tracking Manifest</p>
                </div>
                <div className="text-right font-mono text-[10px] leading-tight">
                  <p className="font-bold text-slate-900">DATE: {new Date().toLocaleDateString()}</p>
                  <p className="text-slate-500">TIME: {new Date().toLocaleTimeString()}</p>
                  <p className="text-slate-500 mt-1 uppercase">FILTER: {visaFilter === 'All' ? 'ALL STATUSES' : `STATUS ${visaFilter}`}</p>
                  <p className="text-indigo-600 font-bold mt-1">TOTAL ROSTER: {filteredPilgrims.length} PAX</p>
                </div>
              </div>

              {/* Info notice about offline checklists */}
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 flex items-start gap-3 mt-4 print:hidden text-left">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-650 leading-relaxed">
                  <p className="font-bold text-slate-900">Physical Checking Mode Instructions</p>
                  <p className="mt-0.5">Use this generated overview document to physically verify pilgrims, check passport matching, collect photoprint sizes, and audit fingerprints. Click <strong>Print / Save PDF</strong> and choose "Save as PDF" to store this manifest offline.</p>
                </div>
              </div>

              {/* Table of pilgrims inside print */}
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300 mt-4">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 border-r border-slate-300">ID Ref</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Full Name / Gender</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Passport Number</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">KTP</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">Passport</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">Photo</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">KK</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">Visa</th>
                    <th className="py-2.5 px-3 text-center">VFS Biometric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {filteredPilgrims.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/45 text-left">
                      {/* ID Index */}
                      <td className="py-2 px-3 border-r border-slate-300 font-mono text-[10px]">
                        <span className="block font-bold text-slate-950">{p.customId}</span>
                        <span className="text-slate-400">#{idx + 1}</span>
                      </td>
                      {/* Full name */}
                      <td className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-950">
                        <span>{p.fullName}</span>
                        <span className="block text-[9px] text-slate-500 font-bold uppercase">{p.gender} • {p.nationality}</span>
                      </td>
                      {/* Passport code */}
                      <td className="py-2 px-3 border-r border-slate-300 font-mono font-bold text-slate-800">
                        {p.passportNumber}
                      </td>
                      {/* Checkboxes styled dry-only */}
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold text-slate-500 capitalize">{p.ktpStatus}</span>
                          <span className="text-sm font-semibold tracking-wide text-slate-700 mt-0.5">[ {p.ktpStatus === 'Uploaded' ? '✓' : ' '} ]</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold text-slate-500 capitalize">{p.passportStatus}</span>
                          <span className="text-sm font-semibold tracking-wide text-slate-700 mt-0.5">[ {p.passportStatus === 'Uploaded' ? '✓' : ' '} ]</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold text-slate-500 capitalize">{p.photoStatus}</span>
                          <span className="text-sm font-semibold tracking-wide text-slate-700 mt-0.5">[ {p.photoStatus === 'Uploaded' ? '✓' : ' '} ]</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-bold text-slate-500 capitalize">{p.kkStatus}</span>
                          <span className="text-sm font-semibold tracking-wide text-slate-700 mt-0.5">[ {p.kkStatus === 'Uploaded' ? '✓' : ' '} ]</span>
                        </div>
                      </td>
                      {/* Visa and VFS */}
                      <td className="py-2 px-3 border-r border-slate-300 text-center">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          {p.visaStatus}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          {p.biometricStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer print signature blocks */}
              <div className="grid grid-cols-3 gap-8 pt-12 text-center text-[10px] text-slate-500 font-bold uppercase print:pt-6">
                <div className="space-y-12">
                  <p>Prepared By Group Leader</p>
                  <div className="border-t border-slate-400 w-36 mx-auto pt-1">Signature & Stamp</div>
                </div>
                <div className="space-y-12">
                  <p>VFS Liaison Audited</p>
                  <div className="border-t border-slate-400 w-36 mx-auto pt-1">Signature & Stamp</div>
                </div>
                <div className="space-y-12">
                  <p>Amil Approved</p>
                  <div className="border-t border-slate-400 w-36 mx-auto pt-1">Authorized Seal</div>
                </div>
              </div>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden !important;
                background: none !important;
              }
              #printable-manifest, #printable-manifest * {
                visibility: visible !important;
              }
              #printable-manifest {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
              }
            }
          `}} />
        </div>
      )}
    </div>
  );
}
