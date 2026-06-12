import React, { useState, useEffect } from 'react';
import { safeAuth, dbService, useFallback, localDb } from './firebase';
import { Pilgrim, RecentActivity, SyarikahReport, UserProfile, UserRole } from './types';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PilgrimManagementView from './components/PilgrimManagementView';
import DocumentCenterView from './components/DocumentCenterView';
import BiometricVFSView from './components/BiometricVFSView';
import VisaReportView from './components/VisaReportView';
import SettingsView from './components/SettingsView';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Firestore real-time synchronized data states
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [syarikahReports, setSyarikahReports] = useState<SyarikahReport[]>([]);

  // Auth Guard state listeners
  useEffect(() => {
    const unsubAuth = safeAuth.onStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubAuth();
  }, []);

  // Sync state listeners with database if user logged in
  useEffect(() => {
    if (!currentUser) return;

    const unsubPilgrims = dbService.subscribePilgrims((data) => {
      setPilgrims(data);
    });

    const unsubActivities = dbService.subscribeActivities((data) => {
      setActivities(data);
    });

    const unsubSyarikah = dbService.subscribeSyarikahReports((data) => {
      setSyarikahReports(data);
    });

    return () => {
      unsubPilgrims();
      unsubActivities();
      unsubSyarikah();
    };
  }, [currentUser]);

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setCurrentUser(userProfile);
  };

  const handleLogout = async () => {
    await safeAuth.logout();
    setCurrentUser(null);
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      localStorage.setItem('mej_active_user', JSON.stringify(updated));
      if (!useFallback) {
        try {
          await dbService.updateUserProfile(currentUser.uid, { role: newRole });
        } catch (e) {
          console.error("Failed to update user profile role in Firestore:", e);
        }
      }
    }
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('mej_pilgrims');
    localStorage.removeItem('mej_activities');
    localStorage.removeItem('mej_syarikah_reports');
    window.location.reload();
  };

  // State handlers to pipe changes directly into DB service (which triggers Firestore edits or fallback writes)
  const handleAddNewPilgrim = async (formData: any) => {
    if (!currentUser) return;
    await dbService.addPilgrim({
      ...formData,
      userId: currentUser.uid,
    });
  };

  const handleUpdatePilgrim = async (id: string, updates: any) => {
    await dbService.updatePilgrim(id, updates);
  };

  const handleDeletePilgrim = async (id: string) => {
    await dbService.deletePilgrim(id);
  };

  const handleAddSyarikahReport = async (reportData: any) => {
    await dbService.addSyarikahReport(reportData);
  };

  const filteredPilgrims = React.useMemo(() => {
    if (!globalSearchQuery) return pilgrims;
    const query = globalSearchQuery.toLowerCase().trim();
    return pilgrims.filter((p) => {
      const nameMatch = p.fullName?.toLowerCase().includes(query);
      const passportMatch = p.passportNumber?.toLowerCase().includes(query);
      const customIdMatch = p.customId?.toLowerCase().includes(query);
      
      // Statuses
      const visaStatusMatch = p.visaStatus?.toLowerCase().includes(query);
      const biometricStatusMatch = p.biometricStatus?.toLowerCase().includes(query);
      const ktpStatusMatch = p.ktpStatus?.toLowerCase().includes(query);
      const passportStatusMatch = p.passportStatus?.toLowerCase().includes(query);
      const photoStatusMatch = p.photoStatus?.toLowerCase().includes(query);
      const kkStatusMatch = p.kkStatus?.toLowerCase().includes(query);

      return (
        nameMatch ||
        passportMatch ||
        customIdMatch ||
        visaStatusMatch ||
        biometricStatusMatch ||
        ktpStatusMatch ||
        passportStatusMatch ||
        photoStatusMatch ||
        kkStatusMatch
      );
    });
  }, [pilgrims, globalSearchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-xs text-slate-500 font-bold uppercase tracking-widest gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
        </span>
        Connecting Portals...
      </div>
    );
  }

  // Auth boundary check
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            pilgrims={filteredPilgrims}
            activities={activities}
            syarikahReports={syarikahReports}
            onAddPilgrimBtnClick={() => setActiveTab('pilgrims')}
            onQuickSyarikahAdd={handleAddSyarikahReport}
          />
        );
      case 'pilgrims':
        return (
          <PilgrimManagementView
            pilgrims={filteredPilgrims}
            onAddPilgrim={handleAddNewPilgrim}
            onUpdatePilgrim={handleUpdatePilgrim}
            onDeletePilgrim={handleDeletePilgrim}
          />
        );
      case 'documents':
        return (
          <DocumentCenterView
            pilgrims={filteredPilgrims}
            onUpdatePilgrim={handleUpdatePilgrim}
          />
        );
      case 'biometrics':
        return (
          <BiometricVFSView
            pilgrims={filteredPilgrims}
            onUpdatePilgrim={handleUpdatePilgrim}
          />
        );
      case 'visa-reports':
        return (
          <VisaReportView
            syarikahReports={syarikahReports}
            pilgrims={filteredPilgrims}
            onAddSyarikahReport={handleAddSyarikahReport}
          />
        );
      case 'settings':
        return (
          <SettingsView
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onResetDatabase={handleResetDatabase}
          />
        );
      default:
        return <div className="text-xs">Select active option.</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Side Nav Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main portal stage container */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTab={activeTab} 
          pilgrims={pilgrims} 
          searchTerm={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
        />

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
