import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAllFreeSlotBookings,
  getAllStudents,
  getAllInquiries,
  approveStudentPayment,
  refreshAdminData,
  subscribeToDatabaseChanges,
  deleteFreeSlotBooking,
  updateFreeSlotBookingStatus as updateFreeSlotDb,
  FreeSlotBookingRecord,
  CentralStudent,
} from '../../services/centralStudentDatabase';
import {
  useAdminSession,
  logoutMasterAdmin,
  AdminSession,
  AppointmentRecord,
} from '../../lib/backend';
import { usePopup } from '../../context/PopupContext';

export type AdminSection = 'overview' | 'mentorship' | 'students' | 'slots' | 'payments' | 'inquiries';
export type AdminTab = 'mentorship_tracker' | 'registered_students' | 'free_sessions' | 'payment_approvals' | 'all_inquiries' | 'overview';

export const SECTION_TO_TAB: Record<AdminSection, AdminTab> = {
  overview: 'overview',
  mentorship: 'mentorship_tracker',
  students: 'registered_students',
  slots: 'free_sessions',
  payments: 'payment_approvals',
  inquiries: 'all_inquiries',
};

interface AdminContextValue {
  session: AdminSession | null;
  /** false until the server has told us whether an admin is logged in (prevents login-page flash) */
  sessionReady: boolean;
  setSession: (s: AdminSession | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
  activeSection: AdminSection;
  adminTab: AdminTab;
  selectSection: (id: AdminSection) => void;
  appointments: AppointmentRecord[];
  freeSlotBookings: FreeSlotBookingRecord[];
  centralStudents: CentralStudent[];
  isLoadingAppointments: boolean;
  isLoadingFreeSlots: boolean;
  dbConnected: boolean;
  approvingId: string | null;
  totalCount: number;
  loadAppointments: () => Promise<void>;
  loadFreeSlotBookings: () => Promise<void>;
  loadCentralStudents: () => Promise<void>;
  handleRefreshAll: () => Promise<void>;
  handleLogout: () => void;
  handleApproveCentralPayment: (s: CentralStudent) => Promise<void>;
  updateFreeSlotBookingStatus: (id: string, st: 'confirmed' | 'cancelled' | 'pending' | 'completed') => Promise<void>;
  deleteFreeSlotBookingAndRefresh: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, checked: sessionReady } = useAdminSession();
  const { showConfirm, showSuccess } = usePopup();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingFreeSlots, setIsLoadingFreeSlots] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [freeSlotBookings, setFreeSlotBookings] = useState<FreeSlotBookingRecord[]>([]);
  const [centralStudents, setCentralStudents] = useState<CentralStudent[]>([]);

  const selectSection = useCallback((id: AdminSection) => {
    setActiveSection(id);
    setAdminTab(SECTION_TO_TAB[id]);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // React state <- in-memory cache (which is filled from the DATABASE by refreshAdminData)
  const syncFromCache = useCallback(() => {
    setCentralStudents([...getAllStudents()]);
    setFreeSlotBookings([...getAllFreeSlotBookings()]);
    setAppointments([...getAllInquiries()] as AppointmentRecord[]);
  }, []);

  const loadAll = useCallback(async () => {
    const ok = await refreshAdminData();
    setDbConnected(ok);
  }, []);

  const loadFreeSlotBookings = useCallback(async () => {
    setIsLoadingFreeSlots(true);
    try {
      await loadAll();
    } finally {
      setIsLoadingFreeSlots(false);
    }
  }, [loadAll]);

  const loadCentralStudents = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const loadAppointments = useCallback(async () => {
    setIsLoadingAppointments(true);
    try {
      await loadAll();
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [loadAll]);

  const handleRefreshAll = useCallback(async () => {
    setIsLoadingAppointments(true);
    try {
      await loadAll();
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [loadAll]);

  useEffect(() => {
    const unsub = subscribeToDatabaseChanges(syncFromCache);
    syncFromCache();
    return unsub;
  }, [syncFromCache]);

  // While an admin is logged in: load everything from the DB, then keep it fresh
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const refresh = () => {
      if (cancelled || document.visibilityState === 'hidden') return;
      void loadAll();
    };
    setIsLoadingAppointments(true);
    void loadAll().finally(() => setIsLoadingAppointments(false));
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    const timer = window.setInterval(refresh, 20000);
    const onSection = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as AdminSection;
      if (id && SECTION_TO_TAB[id]) selectSection(id);
    };
    const onRefreshEvt = () => {
      void loadAll();
    };
    window.addEventListener('hk-admin-section', onSection as EventListener);
    window.addEventListener('hk-admin-refresh', onRefreshEvt);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      window.clearInterval(timer);
      window.removeEventListener('hk-admin-section', onSection as EventListener);
      window.removeEventListener('hk-admin-refresh', onRefreshEvt);
    };
  }, [session, loadAll, selectSection]);

  const handleLogout = useCallback(() => {
    void showConfirm(
      'Log Out of Admin Portal?',
      'Are you sure you want to end your admin session? Any unsaved work may be lost.',
      { confirmText: 'Yes, Log Out', cancelText: 'Cancel' }
    ).then((ok) => {
      if (!ok) return;
      void logoutMasterAdmin();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showSuccess(
        'Logged Out Successfully',
        'Your admin session has been securely ended. See you soon!'
      );
    });
  }, [showConfirm, showSuccess]);

  const setSession = useCallback((_s: AdminSession | null) => {
    /* the session is created/cleared by loginMasterAdmin() / logoutMasterAdmin() */
  }, []);

  const handleApproveCentralPayment = useCallback(async (student: CentralStudent) => {
    setApprovingId(student.studentId);
    try {
      const res = await approveStudentPayment(student.studentId);
      if (!res.success) throw new Error(res.message || 'Server approval failed');
    } finally {
      setApprovingId(null);
    }
  }, []);

  const updateFreeSlotBookingStatus = useCallback(async (id: string, st: 'confirmed' | 'cancelled' | 'pending' | 'completed') => {
    await updateFreeSlotDb(id, st);
  }, []);

  const deleteFreeSlotBookingAndRefresh = useCallback(async (id: string) => {
    await deleteFreeSlotBooking(id);
  }, []);

  const totalCount = useMemo(() => appointments.length, [appointments]);

  const value: AdminContextValue = {
    session, sessionReady, setSession, sidebarOpen, setSidebarOpen, activeSection, adminTab, selectSection,
    appointments, freeSlotBookings, centralStudents, isLoadingAppointments, isLoadingFreeSlots,
    dbConnected: dbConnected, approvingId, totalCount, loadAppointments, loadFreeSlotBookings,
    loadCentralStudents, handleRefreshAll, handleLogout, handleApproveCentralPayment,
    updateFreeSlotBookingStatus, deleteFreeSlotBookingAndRefresh,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
