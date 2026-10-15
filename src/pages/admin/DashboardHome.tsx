import React from 'react';
import { Users, CreditCard, CalendarDays, MessageSquare, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAdmin, AdminSection } from './AdminContext';

const Card: React.FC<{ title: string; value: number; icon: any; onClick: () => void; highlight?: boolean }> = ({ 
  title, value, icon: Icon, onClick, highlight = false 
}) => (
  <button 
    onClick={onClick} 
    className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md ${
      highlight && value > 0 
        ? 'border-[#C8A45D]/50 bg-gradient-to-br from-[#FDFBF7] to-[#F7F2E8]' 
        : 'border-stone-200/80 bg-white hover:border-stone-300'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C8A45D]/15 text-[#8A651E] transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <div className="rounded-full bg-stone-100 p-1.5 text-stone-400 transition-colors group-hover:bg-stone-900 group-hover:text-white">
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold font-cinzel text-stone-900 tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-stone-600">{title}</p>
    </div>
  </button>
);

export const DashboardHome: React.FC = () => {
  const { centralStudents, freeSlotBookings, appointments, selectSection } = useAdmin();
  
  const pending = centralStudents.filter(s => s.paymentStatus === 'pending_approval').length;
  const inquiries = appointments.filter(a => !a.student_id || a.activity_type === 'inquiry').length;

  const cards: [string, number, any, AdminSection, boolean][] = [
    ['Registered Students', centralStudents.length, Users, 'students', false],
    ['Pending UPI Approvals', pending, CreditCard, 'payments', true],
    ['Free Slot Bookings', freeSlotBookings.length, CalendarDays, 'slots', false],
    ['Inquiries & Leads', inquiries, MessageSquare, 'inquiries', false],
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A651E] bg-[#F7F2E8] px-2.5 py-0.5 rounded-md">
            Operations Overview
          </span>
          <h1 className="mt-1 font-cinzel text-2xl font-bold text-stone-900 sm:text-3xl">
            Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Real-time control panel for student tracking, approvals, and scheduling.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600">
            <ShieldCheck className="h-4 w-4 text-[#C8A45D]" />
            <span>Master Secure</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([t, v, i, s, h]) => (
          <Card key={t} title={t} value={v} icon={i} onClick={() => selectSection(s)} highlight={h} />
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-[#8A651E]" />
          <h2 className="font-cinzel text-base font-bold text-stone-900">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => selectSection('students')} 
            className="rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-stone-800"
          >
            Manage Students
          </button>
          <button 
            onClick={() => selectSection('payments')} 
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-300"
          >
            Review Payments {pending > 0 && <span className="ml-1.5 rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-bold">{pending}</span>}
          </button>
          <button 
            onClick={() => selectSection('mentorship')} 
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-300"
          >
            Open Mentorship Tracker
          </button>
        </div>
      </div>

    </div>
  );
};