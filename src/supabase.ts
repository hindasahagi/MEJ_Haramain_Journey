import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');
};

export const supabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema for Supabase Quick Setup:
 * 
 * -- Create pilgrims table
 * CREATE TABLE pilgrims (
 *   id TEXT PRIMARY KEY,
 *   "customId" TEXT NOT NULL,
 *   "fullName" TEXT NOT NULL,
 *   "passportNumber" TEXT NOT NULL,
 *   nationality TEXT NOT NULL,
 *   gender TEXT NOT NULL,
 *   dob TEXT NOT NULL,
 *   "vfsCenter" TEXT NOT NULL,
 *   "preferredDate" TEXT NOT NULL,
 *   "preferredTime" TEXT NOT NULL,
 *   "quotaStatus" TEXT NOT NULL,
 *   "visaBatch" TEXT NOT NULL,
 *   "ktpStatus" TEXT NOT NULL,
 *   "passportStatus" TEXT NOT NULL,
 *   "photoStatus" TEXT NOT NULL,
 *   "kkStatus" TEXT NOT NULL,
 *   "visaStatus" TEXT NOT NULL,
 *   "biometricStatus" TEXT NOT NULL,
 *   "visaExpiryDate" TEXT,
 *   "userId" TEXT NOT NULL,
 *   "createdAt" TEXT NOT NULL,
 *   "updatedAt" TEXT NOT NULL
 * );
 * 
 * -- Create activities table
 * CREATE TABLE activities (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   timestamp TEXT NOT NULL,
 *   "createdAt" TEXT NOT NULL,
 *   "userId" TEXT NOT NULL
 * );
 * 
 * -- Create syarikah_reports table
 * CREATE TABLE syarikah_reports (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   "sponsorId" TEXT NOT NULL,
 *   "visaNo" TEXT NOT NULL,
 *   "qtyMale" INTEGER NOT NULL DEFAULT 0,
 *   "qtyFemale" INTEGER NOT NULL DEFAULT 0,
 *   "usedMale" INTEGER NOT NULL DEFAULT 0,
 *   "usedFemale" INTEGER NOT NULL DEFAULT 0,
 *   "availMale" INTEGER NOT NULL DEFAULT 0,
 *   "availFemale" INTEGER NOT NULL DEFAULT 0,
 *   sourcing TEXT NOT NULL
 * );
 */
