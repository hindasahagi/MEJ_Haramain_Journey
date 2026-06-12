import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, initializeFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { isSupabaseConfigured, supabaseClient } from './supabase';
import defaultSyarikah from './parsed-syarikah.json';
import firebaseConfigData from '../firebase-applet-config.json';

let firebaseConfig: any = firebaseConfigData;
let useFallback = true;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
  useFallback = false;
}

// Global state fallback for seamless multi-device or multi-tab simulation
class LocalDatabaseSimulation {
  private listeners: { [key: string]: Set<(data: any) => void> } = {};

  constructor() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('mej_')) {
        this.trigger(e.key.replace('mej_', ''));
      }
    });
    // Seed initial data if empty
    this.seedDefaults();
  }

  private seedDefaults() {
    if (!localStorage.getItem('mej_pilgrims')) {
      const defaultPilgrims = [
        {
          id: 'pilgrim-1',
          customId: '2027-HFR-001',
          fullName: 'Ahmad Mukhtar',
          passportNumber: 'X12345678',
          nationality: 'Indonesia',
          gender: 'Male',
          dob: '1982-05-14',
          vfsCenter: 'Jakarta - South Central',
          preferredDate: '2024-10-08',
          preferredTime: 'Morning',
          quotaStatus: 'ready',
          visaBatch: 'Batch 2024-A - Abdullah (4 slots left)',
          ktpStatus: 'Uploaded',
          passportStatus: 'Uploaded',
          photoStatus: 'Uploaded',
          kkStatus: 'Uploaded',
          visaStatus: 'Stamped',
          biometricStatus: 'Completed',
          visaExpiryDate: '2026-06-25',
          userId: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'pilgrim-2',
          customId: '2027-HFR-042',
          fullName: 'Siti Nurhaliza',
          passportNumber: 'A98765432',
          nationality: 'Malaysia',
          gender: 'Female',
          dob: '1990-08-20',
          vfsCenter: 'Kuala Lumpur - VFS TasHeel',
          preferredDate: '2024-10-10',
          preferredTime: 'Afternoon',
          quotaStatus: 'pending',
          visaBatch: 'Batch 2024-B - Hossam (12 slots left)',
          ktpStatus: 'Uploaded',
          passportStatus: 'Uploaded',
          photoStatus: 'Missing',
          kkStatus: 'Missing',
          visaStatus: 'Processed',
          biometricStatus: 'Pending',
          visaExpiryDate: '2026-07-08',
          userId: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'pilgrim-3',
          customId: '2027-HFR-108',
          fullName: 'Farhan Kamil',
          passportNumber: 'C1284755',
          nationality: 'Turkey',
          gender: 'Male',
          dob: '1985-04-12',
          vfsCenter: 'Istanbul - European Side',
          preferredDate: '2024-10-08',
          preferredTime: 'Morning',
          quotaStatus: 'ready',
          visaBatch: 'Batch 2024-C - VIP Premium (2 slots left)',
          ktpStatus: 'Uploaded',
          passportStatus: 'Uploaded',
          photoStatus: 'Uploaded',
          kkStatus: 'Uploaded',
          visaStatus: 'Pending',
          biometricStatus: 'Scheduled',
          visaExpiryDate: '2026-08-12',
          userId: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'pilgrim-4',
          customId: '2027-HFR-109',
          fullName: 'Ahmad Budianto',
          passportNumber: 'C1284755',
          nationality: 'Indonesia',
          gender: 'Male',
          dob: '1988-11-25',
          vfsCenter: 'Jakarta - South Central',
          preferredDate: '2024-10-08',
          preferredTime: 'Morning',
          quotaStatus: 'ready',
          visaBatch: 'Batch 2024-A - Abdullah (4 slots left)',
          ktpStatus: 'Uploaded',
          passportStatus: 'Uploaded',
          photoStatus: 'Uploaded',
          kkStatus: 'Uploaded',
          visaStatus: 'Stamped',
          biometricStatus: 'Completed',
          visaExpiryDate: '2026-06-22',
          userId: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'pilgrim-5',
          customId: '2027-HFR-110',
          fullName: 'Siti Turmiah',
          passportNumber: 'C9920311',
          nationality: 'Indonesia',
          gender: 'Female',
          dob: '1979-02-18',
          vfsCenter: 'Jakarta - South Central',
          preferredDate: '2024-10-08',
          preferredTime: 'Morning',
          quotaStatus: 'ready',
          visaBatch: 'Batch 2024-A - Abdullah (4 slots left)',
          ktpStatus: 'Uploaded',
          passportStatus: 'Uploaded',
          photoStatus: 'Uploaded',
          kkStatus: 'Uploaded',
          visaStatus: 'Pending',
          biometricStatus: 'Scheduled',
          visaExpiryDate: '2026-10-18',
          userId: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('mej_pilgrims', JSON.stringify(defaultPilgrims));
    }

    if (!localStorage.getItem('mej_activities')) {
      const defaultActivities = [
        {
          id: 'act-1',
          title: 'New Pilgrim Added',
          description: 'Ahmad Mukhtar registered into Batch 2024-A.',
          type: 'document',
          timestamp: '2 Minutes Ago',
          createdAt: new Date().toISOString(),
          userId: 'test-user-id'
        },
        {
          id: 'act-2',
          title: 'New Document Uploaded',
          description: 'Passport scan for Abdurrahman J. uploaded by Unit 4.',
          type: 'document',
          timestamp: '12 Minutes Ago',
          createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
          userId: 'test-user-id'
        },
        {
          id: 'act-3',
          title: 'Visa Approved',
          description: 'Haji Furoda Batch 2 visas issued by Embassy.',
          type: 'visa',
          timestamp: '1 Hour Ago',
          createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
          userId: 'test-user-id'
        },
        {
          id: 'act-4',
          title: 'VFS Schedule Update',
          description: 'Biometric schedule for Jakarta branch modified.',
          type: 'biometric',
          timestamp: '3 Hours Ago',
          createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
          userId: 'test-user-id'
        },
        {
          id: 'act-5',
          title: 'System Sync',
          description: 'Manifest data synchronized with Ministry of Hajj.',
          type: 'system',
          timestamp: '5 Hours Ago',
          createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
          userId: 'test-user-id'
        }
      ];
      localStorage.setItem('mej_activities', JSON.stringify(defaultActivities));
    }

    const existingReports = localStorage.getItem('mej_syarikah_reports');
    if (!existingReports || JSON.parse(existingReports).length < 10) {
      localStorage.setItem('mej_syarikah_reports', JSON.stringify(defaultSyarikah));
    }

    if (!localStorage.getItem('mej_user_auth')) {
      const defaultUsers = [
        {
          uid: 'test-user-id',
          email: 'admin@sacredjourney.me',
          password: 'password123',
          name: 'Admin Unit A',
          role: 'Administrator'
        }
      ];
      localStorage.setItem('mej_user_auth', JSON.stringify(defaultUsers));
    }
  }

  public get(collectionName: string): any[] {
    const raw = localStorage.getItem(`mej_${collectionName}`);
    return raw ? JSON.parse(raw) : [];
  }

  public save(collectionName: string, data: any[]) {
    localStorage.setItem(`mej_${collectionName}`, JSON.stringify(data));
    this.trigger(collectionName);
  }

  public on(collectionName: string, callback: (data: any[]) => void): () => void {
    if (!this.listeners[collectionName]) {
      this.listeners[collectionName] = new Set();
    }
    this.listeners[collectionName].add(callback);
    callback(this.get(collectionName));

    return () => {
      this.listeners[collectionName]?.delete(callback);
    };
  }

  private trigger(collectionName: string) {
    const data = this.get(collectionName);
    this.listeners[collectionName]?.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export const localDb = new LocalDatabaseSimulation();

// Initialize Firebase App
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;

if (!useFallback && firebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
    try {
      storage = getStorage(app);
    } catch (storageError) {
      console.warn("Firebase Storage failed to initialize; it may not be enabled in this project's console yet.", storageError);
    }
    
    // Validate Connection to Firestore on boot as per guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase init failed, switching to local robust simulation mode.", error);
    useFallback = true;
  }
}

export { useFallback };

// Safe operation proxies
export const safeAuth = {
  getCurrentUser: () => {
    if (useFallback) {
      const active = localStorage.getItem('mej_active_user');
      return active ? JSON.parse(active) : null;
    }
    const fbUser = auth?.currentUser;
    if (!fbUser) return null;
    const localUserStr = localStorage.getItem('mej_active_user');
    const localUser = localUserStr ? JSON.parse(localUserStr) : null;
    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      name: fbUser.displayName || localUser?.name || fbUser.email?.split('@')[0] || 'User',
      role: localUser?.role || 'Administrator'
    };
  },
  onStateChanged: (callback: (user: any | null) => void) => {
    if (useFallback) {
      // Simulate listener
      const handler = () => {
        const active = localStorage.getItem('mej_active_user');
        callback(active ? JSON.parse(active) : null);
      };
      window.addEventListener('storage', handler);
      handler();
      return () => window.removeEventListener('storage', handler);
    }
    
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      
      try {
        const docRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profile = docSnap.data();
          const mappedUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: profile.name || fbUser.displayName || 'User',
            role: profile.role || 'Administrator',
            createdAt: profile.createdAt || new Date().toISOString()
          };
          localStorage.setItem('mej_active_user', JSON.stringify(mappedUser));
          callback(mappedUser);
        } else {
          const defaultProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            role: 'Administrator',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, defaultProfile);
          localStorage.setItem('mej_active_user', JSON.stringify(defaultProfile));
          callback(defaultProfile);
        }
      } catch (err) {
        console.warn("Could not retrieve user data from firestore, mapping from local fallback", err);
        const localUserStr = localStorage.getItem('mej_active_user');
        const localUser = localUserStr ? JSON.parse(localUserStr) : null;
        const mappedUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || localUser?.name || fbUser.email?.split('@')[0] || 'User',
          role: localUser?.role || 'Administrator',
          createdAt: localUser?.createdAt || new Date().toISOString()
        };
        callback(mappedUser);
      }
    });
  },
  signIn: async (email: string, role: string, password?: string) => {
    if (useFallback) {
      const users = localDb.get('user_auth');
      let found = users.find(u => u.email === email);
      if (!found) {
        // Auto-create upon login attempt for smooth developer/reviewer onboarding
        found = {
          uid: 'user-' + Math.random().toString(36).substr(2, 9),
          email: email || 'admin@sacredjourney.me',
          name: 'Admin Unit A',
          role: role || 'Administrator'
        };
        users.push(found);
        localDb.save('user_auth', users);
      }
      // Set active role as requested
      found.role = role || found.role;
      localStorage.setItem('mej_active_user', JSON.stringify(found));
      // Dispatch an event to ensure other tabs/components hear it instantly
      window.dispatchEvent(new Event('storage'));
      return found;
    }

    const cred = await signInWithEmailAndPassword(auth, email, password || 'password123');
    const docRef = doc(db, 'users', cred.user.uid);
    const docSnap = await getDoc(docRef);
    let profile: any;
    if (docSnap.exists()) {
      profile = docSnap.data();
      if (role && profile.role !== role) {
        profile.role = role;
        await setDoc(docRef, profile, { merge: true });
      }
    } else {
      profile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        name: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
        role: role || 'Administrator',
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, profile);
    }
    localStorage.setItem('mej_active_user', JSON.stringify(profile));
    return profile;
  },
  signUp: async (email: string, name: string, role: string, password?: string) => {
    if (useFallback) {
      const newUser = {
        uid: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        role
      };
      const users = localDb.get('user_auth');
      users.push(newUser);
      localDb.save('user_auth', users);
      localStorage.setItem('mej_active_user', JSON.stringify(newUser));
      window.dispatchEvent(new Event('storage'));
      return newUser;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password || 'password123');
    await updateProfile(cred.user, { displayName: name });
    const profile = {
      uid: cred.user.uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    localStorage.setItem('mej_active_user', JSON.stringify(profile));
    return profile;
  },
  logout: async () => {
    localStorage.removeItem('mej_active_user');
    window.dispatchEvent(new Event('storage'));
    if (!useFallback) {
      await signOut(auth);
    }
  }
};

// Error Logger as requested by firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: safeAuth.getCurrentUser()?.uid || null,
      email: safeAuth.getCurrentUser()?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Security/Operation Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Seamless Database CRUD mapping
export const dbService = {
  subscribePilgrims: (onUpdate: (pilgrims: any[]) => void) => {
    if (isSupabaseConfigured() && supabaseClient) {
      supabaseClient.from('pilgrims').select('*').then(({ data, error }) => {
        if (error) console.error('Supabase fetch pilgrims error:', error);
        if (data) onUpdate(data);
      });
      const channel = supabaseClient
        .channel('public:pilgrims')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pilgrims' }, () => {
          supabaseClient.from('pilgrims').select('*').then(({ data }) => {
            if (data) onUpdate(data);
          });
        })
        .subscribe();
      return () => {
        supabaseClient.removeChannel(channel);
      };
    }
    if (useFallback) {
      return localDb.on('pilgrims', onUpdate);
    }
    // Real Firebase onSnapshot
    const q = query(collection(db, 'pilgrims'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'pilgrims'));
  },

  addPilgrim: async (pilgrim: any) => {
    try {
      const pId = 'p-' + Math.random().toString(36).substr(2, 9);
      const newPilgrim = {
        ...pilgrim,
        id: pId,
        biometricStatus: pilgrim.biometricStatus || 'Pending',
        visaExpiryDate: pilgrim.visaExpiryDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isSupabaseConfigured() && supabaseClient) {
        const { error } = await supabaseClient.from('pilgrims').insert([newPilgrim]);
        if (error) console.error('Supabase addPilgrim error:', error);
        // Also add activity to supabase if we can
        const actId = 'act-' + Math.random().toString(36).substr(2, 9);
        await supabaseClient.from('activities').insert([{
          id: actId,
          title: 'New Pilgrim Added',
          description: `Pilgrim "${pilgrim.fullName}" was registered successfully.`,
          type: 'document',
          timestamp: 'Just now',
          createdAt: new Date().toISOString(),
          userId: pilgrim.userId || 'test-user-id'
        }]);
        return pId;
      }

      if (useFallback) {
        const list = localDb.get('pilgrims');
        list.push(newPilgrim);
        localDb.save('pilgrims', list);

        // Auto append interactive log to timeline
        const acts = localDb.get('activities');
        acts.unshift({
          id: 'act-' + Math.random().toString(36).substr(2, 9),
          title: 'New Pilgrim Added',
          description: `Pilgrim "${pilgrim.fullName}" was registered successfully.`,
          type: 'document',
          timestamp: 'Just now',
          createdAt: new Date().toISOString(),
          userId: pilgrim.userId || 'test-user-id'
        });
        localDb.save('activities', acts);
        return pId;
      }

      await setDoc(doc(db, 'pilgrims', pId), newPilgrim);
      return pId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'pilgrims');
    }
  },

  updatePilgrim: async (id: string, updates: any) => {
    try {
      if (isSupabaseConfigured() && supabaseClient) {
        const { error } = await supabaseClient.from('pilgrims').update({ ...updates, updatedAt: new Date().toISOString() }).eq('id', id);
        if (error) console.error('Supabase updatePilgrim error:', error);
        return;
      }
      if (useFallback) {
        const list = localDb.get('pilgrims');
        const idx = list.findIndex(p => p.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
          localDb.save('pilgrims', list);
        }
        return;
      }
      await updateDoc(doc(db, 'pilgrims', id), { ...updates, updatedAt: new Date().toISOString() });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `pilgrims/${id}`);
    }
  },

  deletePilgrim: async (id: string) => {
    try {
      if (isSupabaseConfigured() && supabaseClient) {
        const { error } = await supabaseClient.from('pilgrims').delete().eq('id', id);
        if (error) console.error('Supabase deletePilgrim error:', error);
        return;
      }
      if (useFallback) {
        const list = localDb.get('pilgrims');
        const filtered = list.filter((p: any) => p.id !== id);
        localDb.save('pilgrims', filtered);
        return;
      }
      await deleteDoc(doc(db, 'pilgrims', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `pilgrims/${id}`);
    }
  },

  updateUserProfile: async (uid: string, updates: any) => {
    try {
      if (useFallback) return;
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  },

  subscribeActivities: (onUpdate: (activities: any[]) => void) => {
    if (isSupabaseConfigured() && supabaseClient) {
      supabaseClient.from('activities').select('*').order('createdAt', { ascending: false }).then(({ data }) => {
        if (data) onUpdate(data);
      });
      const channel = supabaseClient
        .channel('public:activities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
          supabaseClient.from('activities').select('*').order('createdAt', { ascending: false }).then(({ data }) => {
            if (data) onUpdate(data);
          });
        })
        .subscribe();
      return () => {
        supabaseClient.removeChannel(channel);
      };
    }
    if (useFallback) {
      return localDb.on('activities', onUpdate);
    }
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'activities'));
  },

  addActivity: async (activity: any) => {
    try {
      const actId = 'act-' + Math.random().toString(36).substr(2, 9);
      const newAct = {
        ...activity,
        id: actId,
        createdAt: new Date().toISOString()
      };
      if (isSupabaseConfigured() && supabaseClient) {
        const { error } = await supabaseClient.from('activities').insert([newAct]);
        if (error) console.error('Supabase addActivity error:', error);
        return actId;
      }
      if (useFallback) {
        const list = localDb.get('activities');
        list.unshift(newAct);
        localDb.save('activities', list);
        return actId;
      }
      await setDoc(doc(db, 'activities', actId), newAct);
      return actId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'activities');
    }
  },

  subscribeSyarikahReports: (onUpdate: (reports: any[]) => void) => {
    if (isSupabaseConfigured() && supabaseClient) {
      supabaseClient.from('syarikah_reports').select('*').then(({ data }) => {
        if (data) onUpdate(data);
      });
      const channel = supabaseClient
        .channel('public:syarikah_reports')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'syarikah_reports' }, () => {
          supabaseClient.from('syarikah_reports').select('*').then(({ data }) => {
            if (data) onUpdate(data);
          });
        })
        .subscribe();
      return () => {
        supabaseClient.removeChannel(channel);
      };
    }
    if (useFallback) {
      return localDb.on('syarikah_reports', onUpdate);
    }
    const q = query(collection(db, 'syarikah_reports'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'syarikah_reports'));
  },

  addSyarikahReport: async (report: any) => {
    try {
      const sId = 'syar-' + Math.random().toString(36).substr(2, 9);
      const newRep = { ...report, id: sId };
      if (isSupabaseConfigured() && supabaseClient) {
        const { error } = await supabaseClient.from('syarikah_reports').insert([newRep]);
        if (error) console.error('Supabase addSyarikahReport error:', error);
        return sId;
      }
      if (useFallback) {
        const list = localDb.get('syarikah_reports');
        list.push(newRep);
        localDb.save('syarikah_reports', list);
        return sId;
      }
      await setDoc(doc(db, 'syarikah_reports', sId), newRep);
      return sId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'syarikah_reports');
    }
  },

  uploadDocument: async (pilgrimId: string, file: File, type: 'passport' | 'visa'): Promise<{ url: string; name: string }> => {
    const filename = file.name;
    try {
      if (useFallback || !storage) {
        throw new Error("Storage fallback active");
      }
      
      const storageRef = ref(storage, `pilgrims/${pilgrimId}/${type}_${Date.now()}_${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      // Update pilgrim doc URL in database
      const updates = type === 'passport' 
        ? { passportPdfUrl: downloadUrl, passportPdfName: filename, passportStatus: 'Uploaded' as const }
        : { visaPdfUrl: downloadUrl, visaPdfName: filename, visaStatus: 'Processed' as const };
        
      await dbService.updatePilgrim(pilgrimId, updates);
      
      // Auto append timeline activity
      await dbService.addActivity({
        title: 'Document Uploaded',
        description: `Securely uploaded ${type === 'passport' ? 'passport' : 'visa'} PDF "${filename}" for Pilgrim ID: ${pilgrimId}.`,
        type: 'document',
        timestamp: 'Just now',
        userId: safeAuth.getCurrentUser()?.uid || 'system'
      });

      return { url: downloadUrl, name: filename };
    } catch (e) {
      console.warn("Storage upload failed or fallback active. Simulating secure client-side blob persistence...", e);
      // Fallback: Read file to create a simulated secure blob URL or base64 data url
      const localUrl = URL.createObjectURL(file);
      let savedUrl = localUrl;

      try {
        if (file.size < 1.5 * 1024 * 1024) { // Only convert if under 1.5MB to avoid quota exceptions
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const base64 = await base64Promise;
          
          // Store raw attachment in temporary browser database or localStorage
          const storageKey = `mej_pdf_${pilgrimId}_${type}`;
          localStorage.setItem(storageKey, base64);
          savedUrl = base64;
        }
      } catch (err) {
        console.warn("Could not serialize Base64 attachment, using temporary session blob URL", err);
      }
      
      const updates = type === 'passport'
        ? { passportPdfUrl: savedUrl, passportPdfName: filename, passportStatus: 'Uploaded' as const }
        : { visaPdfUrl: savedUrl, visaPdfName: filename, visaStatus: 'Processed' as const };
        
      await dbService.updatePilgrim(pilgrimId, updates);

      // Auto append timeline activity
      await dbService.addActivity({
        title: 'Document Uploaded (Simulated)',
        description: `Securely uploaded offline ${type === 'passport' ? 'passport' : 'visa'} PDF "${filename}" for Pilgrim ID: ${pilgrimId}.`,
        type: 'document',
        timestamp: 'Just now',
        userId: safeAuth.getCurrentUser()?.uid || 'system'
      });

      return { url: savedUrl, name: filename };
    }
  }
};
