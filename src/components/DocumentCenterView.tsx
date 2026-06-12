import React, { useState } from 'react';
import { Pilgrim, DocumentStatus, VisaStatus } from '../types';
import { FileText, CheckCircle2, AlertTriangle, XCircle, Search, User, ShieldCheck, Eye, RefreshCw, Barcode, Sparkles, UploadCloud, Loader2, Scan } from 'lucide-react';
import { motion } from 'motion/react';
import DocumentUploadVault from './DocumentUploadVault';

interface DocumentCenterViewProps {
  pilgrims: Pilgrim[];
  onUpdatePilgrim: (id: string, updates: any) => void;
}

export default function DocumentCenterView({ pilgrims, onUpdatePilgrim }: DocumentCenterViewProps) {
  const [selectedPilgrimId, setSelectedPilgrimId] = useState<string>(pilgrims[0]?.id || '');
  const [workstationTab, setWorkstationTab] = useState<'ocr' | 'pdf-vault'>('ocr');
  const [searchQuery, setSearchQuery] = useState('');

  // OCR Upload States
  const [isOcrUploading, setIsOcrUploading] = useState(false);
  const [ocrUploadProgress, setOcrUploadProgress] = useState('');
  const [ocrUploadSuccess, setOcrUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const selectedPilgrim = pilgrims.find((p) => p.id === selectedPilgrimId) || pilgrims[0];

  const triggerDocumentOcr = (type: 'match' | 'mismatch') => {
    if (!selectedPilgrim) return;
    setIsOcrUploading(true);
    setOcrUploadSuccess(false);
    setOcrUploadProgress('Uploading document parcel onto secure MEJ cloud nodes...');

    setTimeout(() => {
      setOcrUploadProgress('Detecting MRZ sub-blocks and parsing identity identifiers...');
    }, 900);

    setTimeout(() => {
      setOcrUploadProgress('Validating checksum structures against pilgrim master roster database...');
    }, 1800);

    setTimeout(() => {
      if (type === 'mismatch') {
        setIsOcrUploading(false);
        setOcrUploadSuccess(false);
        alert(
          `OCR MATCH VERIFICATION FAILED!\n\nDocument details:\nName: "KARTIKA SARI"\nPassport: "B1029417"\nDoes not match current active workstation profile: "${selectedPilgrim.fullName}" (${selectedPilgrim.passportNumber}).\n\nPlease select the correct pilgrim file reference or check the uploaded document page.`
        );
      } else {
        onUpdatePilgrim(selectedPilgrim.id, {
          passportStatus: 'Uploaded',
        });
        setIsOcrUploading(false);
        setOcrUploadSuccess(true);
        setOcrUploadProgress(`AI OCR Match Success! Passport for "${selectedPilgrim.fullName}" (${selectedPilgrim.passportNumber}) has been verified, matched, and status promoted to "Verified".`);
      }
    }, 2700);
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
      if (file.name.toLowerCase().includes('mismatch') || file.name.toLowerCase().includes('wrong')) {
        triggerDocumentOcr('mismatch');
      } else {
        triggerDocumentOcr('match');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().includes('mismatch') || file.name.toLowerCase().includes('wrong')) {
        triggerDocumentOcr('mismatch');
      } else {
        triggerDocumentOcr('match');
      }
    }
  };

  const filteredPilgrims = pilgrims.filter((p) =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAuditAction = (newStatus: DocumentStatus) => {
    if (!selectedPilgrim) return;
    onUpdatePilgrim(selectedPilgrim.id, {
      passportStatus: newStatus,
      // If we verify, we can transition visa to Requesting / Processed
      visaStatus: newStatus === 'Uploaded' ? 'Requesting' : selectedPilgrim.visaStatus
    });
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Uploaded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Verified
          </span>
        );
      case 'Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            In Review
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-700" />
            Missing
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Pilgrim Directory Selector */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#eaebf2] flex flex-col max-h-[620px]">
        <div className="pb-4 border-b border-[#eaebf2] mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Pilgrims Document Queue</h3>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, key, passport..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {filteredPilgrims.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-12">No pilgrims match search criteria.</p>
          ) : (
            filteredPilgrims.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPilgrimId(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  selectedPilgrim?.id === p.id
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.fullName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">{p.customId}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Passport: {p.passportNumber}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Passport Scan</span>
                  {getStatusBadge(p.passportStatus)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: High-Fidelity OCR Document Auditor Box */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#eaebf2] flex flex-col justify-between">
        {selectedPilgrim ? (
          <div className="space-y-6">
            <header className="pb-4 border-b border-[#eaebf2] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Workstation</span>
                <h3 className="text-base font-bold text-slate-900">{selectedPilgrim.fullName}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">FILE REF: {selectedPilgrim.customId}</span>
                <span className="text-[11px] font-semibold text-slate-700">National ID Check Required</span>
              </div>
            </header>

            {/* Workstation View Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setWorkstationTab('ocr')}
                className={`flex items-center gap-2 pb-2.5 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  workstationTab === 'ocr'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
              >
                <Scan className="w-4 h-4" />
                AI OCR Verifier
              </button>
              <button
                onClick={() => setWorkstationTab('pdf-vault')}
                className={`ml-5 flex items-center gap-2 pb-2.5 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  workstationTab === 'pdf-vault'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Official PDF Vault
              </button>
            </div>

            {workstationTab === 'ocr' ? (
              <>
                {/* AI OCR Scan & Verification Dropzone */}
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                      <span>AI OCR Real-time Document Auditor Gateway</span>
                    </div>
                    <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Verificator
                    </span>
                  </div>

                  {isOcrUploading ? (
                    <div className="bg-indigo-950 text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 relative overflow-hidden border border-indigo-900 shadow-md">
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" style={{ animationDuration: '0.9s' }} />
                      <Loader2 className="w-6 h-6 text-indigo-300 animate-spin" />
                      <p className="text-[10px] font-mono text-center text-indigo-100 animate-pulse animate-fade-in">
                        {ocrUploadProgress || 'Processing incoming documents...'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                          dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/20'
                        }`}
                        onClick={() => document.getElementById('workstation-ocr-upload')?.click()}
                      >
                        <input
                          id="workstation-ocr-upload"
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-700">
                          Drag & Drop Passport image to verify for {selectedPilgrim.fullName}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Scans details, extracts text, and matches with active roster profile</p>
                      </div>

                      <div className="flex gap-2 items-center justify-between bg-white border border-slate-200 p-2 rounded-lg text-[10px] font-bold text-slate-700">
                        <span className="text-slate-500 text-[9px] font-semibold">Test Sandbox Simulators:</span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerDocumentOcr('match')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-850 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200/60 rounded text-[9.5px]"
                          >
                            Simulate Perfect Match
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDocumentOcr('mismatch')}
                            className="px-2 py-1 bg-rose-50 text-rose-850 hover:bg-rose-100 hover:text-rose-900 border border-rose-200/60 rounded text-[9.5px]"
                          >
                            Simulate Mismatch Demo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {ocrUploadSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-xl flex items-start gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-950 leading-none">Automated Sync Successful!</p>
                        <p className="text-[9px] text-emerald-800/95 mt-1 leading-relaxed">
                          {ocrUploadProgress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Passport Display Card Representation */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/60 shadow-inner relative overflow-hidden">
                  <div className="absolute right-4 top-4 select-none opacity-10">
                    <ShieldCheck className="w-32 h-32 text-amber-950" />
                  </div>

                  <div className="flex gap-6 items-start">
                    {/* Photo space */}
                    <div className="w-24 h-32 bg-slate-200/80 rounded-lg shrink-0 border border-amber-300 flex flex-col items-center justify-center p-2 relative">
                      <User className="w-10 h-10 text-slate-400" />
                      <span className="text-[8px] text-slate-500 font-bold text-center mt-2 uppercase tracking-tight">Passport Photo</span>
                      {/* Photo status indicator icon watermark */}
                      <div className="absolute bottom-1 right-1 bg-indigo-600 p-0.5 rounded-full text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Scanned fields */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start border-b border-amber-200/80 pb-2">
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Document Type / Kode Negara</span>
                          <p className="text-xs font-bold text-amber-950">P / IDN</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Passport Number</span>
                          <p className="text-xs font-mono font-bold text-amber-950">{selectedPilgrim.passportNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Full Name</span>
                          <p className="text-xs font-bold text-amber-950 uppercase">{selectedPilgrim.fullName}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Nationality</span>
                          <p className="text-xs font-bold text-amber-950">{selectedPilgrim.nationality}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t border-amber-200/80 pt-2">
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Gender</span>
                          <p className="text-xs font-bold text-amber-950 uppercase">{selectedPilgrim.gender}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">Birth Date</span>
                          <p className="text-xs font-bold text-amber-950">{selectedPilgrim.dob}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-wide">VFS Office</span>
                          <p className="text-[10px] font-bold text-amber-950 leading-tight">{selectedPilgrim.vfsCenter}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Machine Readable Zone (MRZ) BARCODE mockup */}
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-300 font-mono text-[9.5px] tracking-[0.16em] text-slate-800 uppercase space-y-0.5">
                    <p>P&lt;IDN{selectedPilgrim.fullName.replace(/\s+/g, '&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                    <p>{selectedPilgrim.passportNumber}&lt;&lt;8IDN8505152M2710156&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;4</p>
                    <div className="flex justify-between items-center mt-3 pt-2">
                      <div className="flex items-center gap-1 text-slate-500 text-[8px] tracking-normal font-semibold">
                        <Barcode className="w-5 h-5 text-amber-900" />
                        OCR Machine Readable Passport (ISO-7501 Compliant)
                      </div>
                      <span className="text-[8px] text-amber-900 font-bold bg-amber-200 px-1 rounded">MATCH 100%</span>
                    </div>
                  </div>
                </div>

                {/* OCR Auditor Verification Panel Actions */}
                <div className="border border-slate-200/80 rounded-2xl p-5 space-y-4 bg-slate-50">
                  <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Auditor Decisions Control</span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAuditAction('Uploaded')}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-300" />
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      onClick={() => handleAuditAction('Review')}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-sm transition-all"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Flag for Revision</span>
                    </button>

                    <button
                      onClick={() => handleAuditAction('Missing')}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Document</span>
                    </button>
                  </div>

                  {/* Checklist review detail info */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-body-md pt-2">
                    <span>Verified by active user role: Admin</span>
                    <span>Audit Stamp: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <DocumentUploadVault pilgrim={selectedPilgrim} onUpdatePilgrim={onUpdatePilgrim} />
            )}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400">
            <p className="font-semibold">No Pilgrim Selected</p>
            <p className="text-xs mt-1">Please select an item from the left directory column to inspect OCR files.</p>
          </div>
        )}
      </div>
    </div>
  );
}
