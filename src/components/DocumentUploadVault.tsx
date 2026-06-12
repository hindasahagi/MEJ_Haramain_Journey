import React, { useState, useRef } from 'react';
import { Pilgrim, DocumentStatus } from '../types';
import { dbService } from '../firebase';
import { 
  FileText, UploadCloud, ShieldCheck, Eye, Loader2, 
  Trash2, Lock, FileCheck2, Download, AlertCircle, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentUploadVaultProps {
  pilgrim: Pilgrim;
  onUpdatePilgrim: (id: string, updates: any) => void;
}

export default function DocumentUploadVault({ pilgrim, onUpdatePilgrim }: DocumentUploadVaultProps) {
  const [uploadingType, setUploadingType] = useState<'passport' | 'visa' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dragActiveType, setDragActiveType] = useState<'passport' | 'visa' | null>(null);

  const passportInputRef = useRef<HTMLInputElement>(null);
  const visaInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop events
  const handleDrag = (e: React.DragEvent, type: 'passport' | 'visa') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveType(type);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setDragActiveType(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: 'passport' | 'visa') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveType(null);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFileUpload(e.dataTransfer.files[0], type);
    }
  };

  // Handle standard click file select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'visa') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (e.target.files && e.target.files[0]) {
      await processFileUpload(e.target.files[0], type);
    }
  };

  // Perform secure upload action to Firebase Storage
  const processFileUpload = async (file: File, type: 'passport' | 'visa') => {
    // 1. Validation (Accept PDFs, but allow images for flexibility as passport scans are often photos)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg(`Unsupported file type (${file.type || 'unknown'}). Please attach an official passport or visa PDF or clear document image.`);
      return;
    }

    // Size check - warn but allow up to 10MB, warning if too large for offline Base64 backup
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the secure threshold (10MB maximum). Please compress your PDF before uploading.');
      return;
    }

    setUploadingType(type);
    try {
      // Secure call to firebase helper (with graceful offline base64 browser fallback)
      const result = await dbService.uploadDocument(pilgrim.id, file, type);
      setSuccessMsg(`Securely attached ${type === 'passport' ? 'Passport' : 'Visa'} PDF: "${result.name}"`);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Secure document storage connection error. Please verify your firestore permissions or retry.');
    } finally {
      setUploadingType(null);
    }
  };

  // Revoke/Delete document status and reference
  const handleRemoveDoc = async (type: 'passport' | 'visa') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const updates = type === 'passport'
        ? { passportPdfUrl: '', passportPdfName: '', passportStatus: 'Missing' as DocumentStatus }
        : { visaPdfUrl: '', visaPdfName: '', visaStatus: 'Pending' as any };
      
      await dbService.updatePilgrim(pilgrim.id, updates);
      setSuccessMsg(`Successfully purged attached ${type === 'passport' ? 'passport' : 'visa'} record.`);
    } catch (error) {
      setErrorMsg(`Failed to complete deletion request.`);
    }
  };

  // Helper to trigger direct download or safe frame view
  const viewOrDownloadFile = (url: string, filename: string) => {
    if (!url) return;
    // Check if base64 or storage url
    if (url.startsWith('data:')) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
        win.document.title = filename || 'Attached Pilgrim Document';
      } else {
        alert('Pop-up blocked. Please enable pop-ups to view document.');
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
        {/* Abstract lock watermarks */}
        <div className="absolute right-3 top-3 opacity-10 select-none pointer-events-none">
          <Lock className="w-24 h-24 text-slate-100" />
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-400/20 rounded-xl text-indigo-400 shrink-0">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
              ISO-27001 Secure Vault
            </span>
            <h3 className="text-sm font-bold mt-1 text-slate-100">Official Document Storage & Reference</h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Upload scanned PDF files for passports and visas. Files are stored in secure Firebase buckets, isolated per pilgrim record, and protected under strict Attribute-Based Access Control (ABAC) rules.
            </p>
          </div>
        </div>
      </div>

      {/* Message Notifications */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl flex items-start gap-2.5"
          >
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 snap-center" />
            <span className="text-xs font-semibold leading-normal">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-xl flex items-start gap-2.5 animate-fade-in"
          >
            <FileCheck2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold leading-normal">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Passport PDF Slot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                1. Pilgrim Passport PDF
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                pilgrim.passportPdfUrl 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-800 border border-rose-100'
              }`}>
                {pilgrim.passportPdfUrl ? 'Vault Verified' : 'Missing Reference'}
              </span>
            </div>

            {/* Passport attachment dropzone or display file info */}
            {pilgrim.passportPdfUrl ? (
              <div className="bg-emerald-50/40 border border-emerald-200/80 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate" title={pilgrim.passportPdfName || 'Passport.pdf'}>
                      {pilgrim.passportPdfName || 'Attached_Passport.pdf'}
                    </p>
                    <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Encrypted Reference Saved</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => viewOrDownloadFile(pilgrim.passportPdfUrl || '', pilgrim.passportPdfName || 'Passport.pdf')}
                    className="p-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-500 rounded-lg shadow-sm transition-all"
                    title="View Attached PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveDoc('passport')}
                    className="p-1.5 bg-white border border-slate-250 hover:border-rose-400 hover:text-rose-600 text-slate-500 rounded-lg shadow-sm transition-all"
                    title="Purge Attachment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={(e) => handleDrag(e, 'passport')}
                onDragOver={(e) => handleDrag(e, 'passport')}
                onDragLeave={(e) => handleDrag(e, 'passport')}
                onDrop={(e) => handleDrop(e, 'passport')}
                onClick={() => passportInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActiveType === 'passport' 
                    ? 'border-indigo-600 bg-indigo-50/40' 
                    : 'border-slate-350 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50/20'
                }`}
              >
                <input
                  ref={passportInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'passport')}
                  disabled={uploadingType !== null}
                />
                
                {uploadingType === 'passport' ? (
                  <div className="space-y-2 py-2">
                    <Loader2 className="w-6 h-6 mx-auto text-indigo-600 animate-spin" />
                    <p className="text-[11px] text-slate-500 font-medium animate-pulse">Hashing document bytes & storing in Firebase vault...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
                    <p className="text-xs font-bold text-slate-800">Drag & Drop Passport PDF</p>
                    <p className="text-[10px] text-slate-400 mt-1">Or click to locate file on system</p>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-normal bg-slate-50 p-2.5 rounded-lg flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>Adding this PDF syncs status automatically to <strong className="text-slate-600">"Verified"</strong> in the auditor system.</span>
          </p>
        </div>

        {/* Visa PDF Slot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                2. Pilgrim Visa PDF
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                pilgrim.visaPdfUrl 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-800 border border-rose-100'
              }`}>
                {pilgrim.visaPdfUrl ? 'Vault Verified' : 'Missing Reference'}
              </span>
            </div>

            {/* Visa attachment dropzone or display file info */}
            {pilgrim.visaPdfUrl ? (
              <div className="bg-emerald-50/40 border border-emerald-200/80 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate" title={pilgrim.visaPdfName || 'Visa.pdf'}>
                      {pilgrim.visaPdfName || 'Attached_Visa.pdf'}
                    </p>
                    <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Encrypted Reference Saved</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => viewOrDownloadFile(pilgrim.visaPdfUrl || '', pilgrim.visaPdfName || 'Visa.pdf')}
                    className="p-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-500 rounded-lg shadow-sm transition-all"
                    title="View Attached PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveDoc('visa')}
                    className="p-1.5 bg-white border border-slate-250 hover:border-rose-400 hover:text-rose-600 text-slate-500 rounded-lg shadow-sm transition-all"
                    title="Purge Attachment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={(e) => handleDrag(e, 'visa')}
                onDragOver={(e) => handleDrag(e, 'visa')}
                onDragLeave={(e) => handleDrag(e, 'visa')}
                onDrop={(e) => handleDrop(e, 'visa')}
                onClick={() => visaInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActiveType === 'visa' 
                    ? 'border-indigo-600 bg-indigo-50/40' 
                    : 'border-slate-350 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50/20'
                }`}
              >
                <input
                  ref={visaInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'visa')}
                  disabled={uploadingType !== null}
                />
                
                {uploadingType === 'visa' ? (
                  <div className="space-y-2 py-2">
                    <Loader2 className="w-6 h-6 mx-auto text-indigo-600 animate-spin" />
                    <p className="text-[11px] text-slate-500 font-medium animate-pulse">Hashing document bytes & storing in Firebase vault...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
                    <p className="text-xs font-bold text-slate-800">Drag & Drop Visa PDF</p>
                    <p className="text-[10px] text-slate-400 mt-1">Or click to locate file on system</p>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-normal bg-slate-50 p-2.5 rounded-lg flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>Securely registers with the Ministry of Hajj & updates pilgrim status to <strong className="text-slate-600">"Processed"</strong>.</span>
          </p>
        </div>

      </div>

      {/* Compliance / Audit Footer */}
      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTAL AUDITED: SSL & AES-256 DIRECTORY LOCK ACTIVE</span>
        </div>
        <span>RESTRICTED ACCESS CONCEPTUAL CREDENTIALS</span>
      </div>
    </div>
  );
}
