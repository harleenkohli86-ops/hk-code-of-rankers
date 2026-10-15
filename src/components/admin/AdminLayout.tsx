import React from 'react';
import { LayoutDashboard, GraduationCap, Users, CalendarDays, CreditCard, MessageSquare, LogOut, Menu, X, RefreshCw } from 'lucide-react';
import { useAdmin, AdminSection } from '../../pages/admin/AdminContext';
import { PageId } from '../../types';

const items: { id: AdminSection; label: string; desc: string; icon: any }[] = [
  { id: 'overview', label: 'Dashboard', desc: 'Stats & quick actions', icon: LayoutDashboard },
  { id: 'mentorship', label: 'Mentorship Tracker', desc: 'Progress & calls', icon: GraduationCap },
  { id: 'students', label: 'Students', desc: 'Registered records', icon: Users },
  { id: 'slots', label: 'Free Slot Bookings', desc: 'Demo & counselling', icon: CalendarDays },
  { id: 'payments', label: 'UPI Approvals', desc: 'Payments & activation', icon: CreditCard },
  { id: 'inquiries', label: 'Inquiries', desc: 'Leads & messages', icon: MessageSquare },
];

export const AdminLayout: React.FC<{ children: React.ReactNode; onNavigate: (p: PageId) => void }> = ({ children }) => {
  const { session, activeSection, selectSection, setSidebarOpen, sidebarOpen, handleLogout, handleRefreshAll, isLoadingAppointments } = useAdmin();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 selection:bg-[#C8A45D]/20">
      
      {/* Top Navigation Bar (Pure White & Natural Light) */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-stone-700 hover:bg-stone-100 lg:hidden transition-colors"
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C8A45D] text-stone-950 font-bold shadow-xs">
              HK
            </div>
            <div>
              <p className="font-cinzel text-sm font-bold text-stone-900 tracking-wide">MASTER ADMIN</p>
              <p className="hidden text-[10px] font-medium text-stone-500 sm:block">HK Code of Rankers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-[200px] truncate rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 sm:block border border-stone-200/60">
              {session?.adminEmail}
            </span>
            <button
              onClick={() => handleRefreshAll()}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-2 text-stone-700 hover:bg-stone-50 shadow-2xs transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingAppointments ? 'animate-spin text-[#C8A45D]' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 p-2 text-red-600 hover:bg-red-100 transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Content Container */}
      <div className="mx-auto flex max-w-[1600px]">
        
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-16 left-0 z-40 w-72 border-r border-stone-200/85 bg-white p-4 text-stone-800 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 shadow-sm lg:shadow-none flex flex-col justify-between`}
        >
          <nav className="space-y-1.5 overflow-y-auto pr-1">
            {items.map(({ id, label, desc, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    selectSection(id);
                    setSidebarOpen(false); // auto-close sidebar on mobile after clicking
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all ${
                    isActive
                      ? 'bg-[#111] text-white shadow-md'
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#C8A45D]' : 'text-stone-500'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold tracking-wide">{label}</span>
                    <span className={`block text-[11px] font-normal ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                      {desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer Info Box inside Sidebar */}
          <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50 p-3.5 text-[11px] leading-relaxed text-stone-500">
            <span className="font-semibold text-stone-700 block mb-0.5">Secure Workspace</span>
            Authenticated session required to load student records and approve payment entries.
          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-16 z-30 bg-stone-900/30 backdrop-blur-2xs lg:hidden"
          />
        )}

        {/* Main View Area */}
        <main className="min-w-0 flex-1 p-4">
          {children}
        </main>

      </div>
    </div>
  );
};