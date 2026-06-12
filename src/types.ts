export type UserRole = 'Administrator' | 'Admin' | 'Supervisor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export type DocumentStatus = 'Uploaded' | 'Review' | 'Missing';
export type VisaStatus = 'Stamped' | 'Processed' | 'Requesting' | 'Pending' | 'Rejected';

export interface Pilgrim {
  id: string; // Document ID / System assigned ID
  customId: string; // e.g. "2027-HFR-001"
  fullName: string;
  passportNumber: string;
  nationality: string;
  gender: 'Male' | 'Female';
  dob: string;
  vfsCenter: string;
  preferredDate: string;
  preferredTime: 'Morning' | 'Afternoon';
  quotaStatus: 'ready' | 'pending';
  visaBatch: string;
  ktpStatus: DocumentStatus;
  passportStatus: DocumentStatus;
  photoStatus: DocumentStatus;
  kkStatus: DocumentStatus;
  visaStatus: VisaStatus;
  biometricStatus: 'Pending' | 'Scheduled' | 'Completed';
  visaExpiryDate?: string; // e.g. "2026-07-10"
  passportPdfUrl?: string;
  passportPdfName?: string;
  visaPdfUrl?: string;
  visaPdfName?: string;
  userId: string; // Isolated associated owner ID
  createdAt: string;
  updatedAt: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'visa' | 'biometric' | 'system';
  timestamp: string; // e.g. "12 Minutes Ago", "1 Hour Ago"
  createdAt: string; // actual server time string
  userId: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'error';
  createdAt: string;
}

export interface BiometricBatch {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:30"
  totalPax: number;
  confirmedPax: number;
}

export interface SyarikahReport {
  id: string;
  name: string;
  sponsorId: string;
  visaNo: string;
  qtyMale: number;
  qtyFemale: number;
  usedMale: number;
  usedFemale: number;
  availMale: number;
  availFemale: number;
  sourcing: string;
}
