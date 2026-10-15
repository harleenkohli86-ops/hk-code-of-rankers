import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  getStudentByEmail,
  approveStudentRegistration,
  rejectStudentRegistration,
  subscribeToDatabaseChanges,
  setCurrentStudent,
  clearLocalCache,
  ProgramName,
  ProgramLevel,
  ProgramGroup,
} from '../services/centralStudentDatabase';
import { apiGet, apiPost } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  /** false until the first "who am I?" answer from the server has arrived */
  authReady: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message: string; isPendingApproval?: boolean }>;
  register: (
    fullName: string,
    email: string,
    phone: string,
    targetExamOrProgram: string,
    pass: string,
    levelInput?: string,
    groupInput?: string
  ) => Promise<{ success: boolean; message: string; pendingApproval?: boolean }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; token?: string; resetUrl?: string }>;
  completePasswordReset: (token: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, newPass: string) => Promise<{ success: boolean; message: string; isPendingApproval?: boolean }>;
  approveStudentAccount: (emailOrId: string) => Promise<{ success: boolean; message: string }>;
  revokeStudentAccount: (emailOrId: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  hasPurchased: (productId: string) => boolean;
  grantPurchase: (productIds: string[]) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authTab: 'login' | 'register' | 'forgot';
  setAuthTab: (tab: 'login' | 'register' | 'forgot') => void;
  allowRegister: boolean;
  setAllowRegister: (allow: boolean) => void;
  openAuthModal: (tab?: 'login' | 'register' | 'forgot', options?: { allowRegister?: boolean }) => void;
  refreshSession: () => Promise<void>;
  refreshAfterPaymentApproval: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Server student record -> UI profile. Only what the UI needs; no secrets. */
export const toUserProfile = (student: any): UserProfile => {
  const purchasedIds: string[] = [];
  if (student.mentorshipAccess) {
    const defaultMentorshipId =
      student.program === 'CS Executive'
        ? student.group === 'Group 2'
          ? 'exec-g2-mentorship'
          : student.group === 'Both Groups'
          ? 'exec-both-mentorship'
          : 'exec-g1-mentorship'
        : student.program === 'CS Professional'
        ? student.group === 'Group 2'
          ? 'prof-g2-mentorship'
          : student.group === 'Both Groups'
          ? 'prof-both-mentorship'
          : 'prof-g1-mentorship'
        : 'cseet-mentorship';
    if (student.purchasedCourse?.courseId) purchasedIds.push(student.purchasedCourse.courseId);
    purchasedIds.push('mentorship-enrolled', defaultMentorshipId);
  }
  if (student.studyIndexAccess) {
    purchasedIds.push('cs-study-progress-index');
    if (student.purchasedCourse?.courseId) purchasedIds.push(student.purchasedCourse.courseId);
  }
  if (student.paymentStatus === 'approved' && student.purchasedCourse?.courseId) {
    if (!purchasedIds.includes(student.purchasedCourse.courseId)) purchasedIds.push(student.purchasedCourse.courseId);
  }
  return {
    id: student.studentId,
    studentId: student.studentId,
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    targetExam: student.targetExam,
    program: student.program,
    level: student.level,
    group: student.group,
    avatar: student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=C8A45D&color=000`,
    purchasedProductIds: purchasedIds,
    createdAt: student.registeredAt,
    isApproved: true,
    approvalStatus: 'approved',
    registrationStatus: 'approved',
    paymentStatus: student.paymentStatus,
    mentorshipAccess: student.mentorshipAccess,
    studyIndexAccess: student.studyIndexAccess,
    assignedIndexId: student.assignedIndexId,
    approvedAt: student.registrationApprovedAt,
    role: 'student',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Login state lives in a secure httpOnly cookie on the server; NOTHING is kept in localStorage.
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [allowRegister, setAllowRegister] = useState(true);

  // Ask the server who is logged in (cookie) when the app loads
  useEffect(() => {
    void refreshSession().finally(() => setAuthReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the in-memory copy of the student changes (e.g. index saved), keep `user` in sync
  useEffect(() => {
    const unsubscribe = subscribeToDatabaseChanges(() => {
      setUser((prev) => {
        if (!prev?.email) return prev;
        const fresh = getStudentByEmail(prev.email);
        return fresh ? toUserProfile(fresh) : prev;
      });
    });
    return unsubscribe;
  }, []);

  const openAuthModal = (
    tab: 'login' | 'register' | 'forgot' = 'login',
    options?: { allowRegister?: boolean }
  ) => {
    if (user || options?.allowRegister === false) {
      setAllowRegister(false);
      setAuthTab(tab === 'register' ? 'login' : tab);
    } else {
      setAllowRegister(options?.allowRegister ?? true);
      setAuthTab(tab);
    }
    setIsAuthModalOpen(true);
  };

  const refreshSession = async (): Promise<void> => {
    const r = await apiGet('/api/auth/me');
    if (r.ok && r.data.student) {
      setCurrentStudent(r.data.student);
      setUser(toUserProfile(r.data.student));
    } else if (r.ok) {
      setUser(null);
    }
    // network error -> keep whatever we had
  };

  /** Re-fetch own profile from DB after admin approves payment (unlock courses). */
  const refreshAfterPaymentApproval = async (): Promise<void> => {
    await refreshSession();
  };

  const login = async (
    emailOrPhone: string,
    pass: string
  ): Promise<{ success: boolean; message: string; isPendingApproval?: boolean }> => {
    if (!emailOrPhone || !pass) {
      return { success: false, message: 'Please provide your registered email and password.' };
    }
    const r = await apiPost('/api/auth/login', { emailOrPhone, password: pass });
    if (!r.ok || !r.data.student) {
      return { success: false, message: r.message || 'Login failed. Please try again.' };
    }
    setCurrentStudent(r.data.student);
    setUser(toUserProfile(r.data.student));
    setIsAuthModalOpen(false);
    return { success: true, message: r.message || `Welcome back, ${r.data.student.fullName}!` };
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    targetExamOrProgram: string,
    pass: string,
    levelInput?: string,
    groupInput?: string
  ): Promise<{ success: boolean; message: string; pendingApproval?: boolean }> => {
    let program: ProgramName = 'CS Executive';
    let level: ProgramLevel = 'Level 2';
    let group: ProgramGroup = 'Group 1';

    const lower = (targetExamOrProgram || '').toLowerCase();
    if (lower.includes('eet')) {
      program = 'CS EET';
      level = 'Level 1';
      group = 'EET';
    } else if (lower.includes('professional') || lower.includes('prof')) {
      program = 'CS Professional';
      level = 'Level 3';
      group = lower.includes('group 2') ? 'Group 2' : lower.includes('both') ? 'Both Groups' : 'Group 1';
    } else {
      program = 'CS Executive';
      level = 'Level 2';
      group = lower.includes('group 2') ? 'Group 2' : lower.includes('both') ? 'Both Groups' : 'Group 1';
    }
    if (levelInput) level = levelInput as ProgramLevel;
    if (groupInput) group = groupInput as ProgramGroup;

    const r = await apiPost('/api/auth/register', { fullName, email, phone, program, level, group, password: pass });
    if (!r.ok || !r.data.student) {
      return { success: false, message: r.message || 'Registration failed. Try again.' };
    }
    setCurrentStudent(r.data.student);
    setUser(toUserProfile(r.data.student));
    setIsAuthModalOpen(false);
    return { success: true, message: 'Account created! Logged into the portal.' };
  };

  /** Server emails a single-use reset link. The link is NEVER returned to the browser. */
  const requestPasswordReset = async (email: string) => {
    const r = await apiPost('/api/auth/forgot-password', { email });
    return { success: r.ok, message: r.message };
  };

  const completePasswordReset = async (token: string, newPass: string) => {
    const r = await apiPost('/api/auth/reset-password', { token, newPassword: newPass });
    return { success: r.ok, message: r.message };
  };

  /** Backward compat: routes to secure link flow. */
  const resetPassword = async (
    email: string,
    _newPass: string
  ): Promise<{ success: boolean; message: string; isPendingApproval?: boolean }> => {
    const res = await requestPasswordReset(email);
    return { success: res.success, message: res.message };
  };

  /** Admin: restore a student's access */
  const approveStudentAccount = async (emailOrId: string): Promise<{ success: boolean; message: string }> => {
    return approveStudentRegistration(emailOrId);
  };

  /** Admin: revoke a student's access */
  const revokeStudentAccount = async (emailOrId: string): Promise<{ success: boolean; message: string }> => {
    const res = await rejectStudentRegistration(emailOrId, 'Access revoked by administrator.');
    if (res.success && user && (user.studentId === emailOrId || user.email.toLowerCase() === emailOrId.toLowerCase())) {
      setUser(null);
    }
    return res;
  };

  const logout = () => {
    void apiPost('/api/auth/logout', {});
    setUser(null);
    clearLocalCache({ keepAdmin: true });
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updatedData });
  };

  const hasPurchased = (productId: string) => {
    if (!user) return false;
    return user.purchasedProductIds.includes(productId);
  };

  const grantPurchase = (productIds: string[]) => {
    if (!user) return;
    const newSet = new Set([...user.purchasedProductIds, ...productIds]);
    const updated: UserProfile = {
      ...user,
      purchasedProductIds: Array.from(newSet),
    };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        register,
        requestPasswordReset,
        completePasswordReset,
        resetPassword,
        approveStudentAccount,
        revokeStudentAccount,
        logout,
        updateProfile,
        hasPurchased,
        grantPurchase,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authTab,
        setAuthTab,
        allowRegister,
        setAllowRegister,
        openAuthModal,
        refreshSession,
        refreshAfterPaymentApproval,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
