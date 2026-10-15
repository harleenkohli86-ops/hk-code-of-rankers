import React, { useState, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import { 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Inbox,
  Loader2 
} from 'lucide-react';

// Explicit Type Definition for Inquiry Item
export interface InquiryItem {
  id?: string;
  student_id?: string;
  activity_type?: string;
  name?: string;
  studentName?: string;
  email?: string;
  phone?: string;
  program?: string;
  targetExam?: string;
  message?: string;
  notes?: string;
  created_at?: string;
}

export const InquiriesSection: React.FC = () => {
  const { appointments = [], isLoadingAppointments, loadAppointments } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inquiries (appointments without student_id or explicit inquiry activity)
  const inquiries = useMemo(() => {
    return (appointments as InquiryItem[]).filter(
      (a) => !a.student_id || a.activity_type === 'inquiry'
    );
  }, [appointments]);

  // Search filter implementation
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return inquiries.slice(0, 100);

    const term = searchTerm.toLowerCase();
    return inquiries
      .filter((r) => {
        const name = (r.name || r.studentName || '').toLowerCase();
        const email = (r.email || '').toLowerCase();
        const phone = (r.phone || '').toLowerCase();
        const program = (r.program || r.targetExam || '').toLowerCase();
        const message = (r.message || r.notes || r.activity_type || '').toLowerCase();

        return (
          name.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          program.includes(term) ||
          message.includes(term)
        );
      })
      .slice(0, 100);
  }, [inquiries, searchTerm]);

  // Safe Date Formatting Utility
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#8A651E]">
            Leads & Messages
          </p>
          <h1 className="font-cinzel text-2xl font-bold text-gray-900 mt-1 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#8A651E]" />
            <span>Inquiries</span>
            <span className="text-xs font-sans font-semibold bg-[#8A651E]/10 text-[#8A651E] px-2.5 py-0.5 rounded-full border border-[#8A651E]/20 ml-2">
              {inquiries.length} Total
            </span>
          </h1>
        </div>

        <button
          onClick={() => loadAppointments()}
          disabled={isLoadingAppointments}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111] hover:bg-black px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAppointments ? 'animate-spin text-[#C8A45D]' : ''}`} />
          <span>{isLoadingAppointments ? 'Refreshing…' : 'Refresh Inquiries'}</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Email, Phone, Program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-black/10 rounded-xl text-xs focus:outline-none focus:border-[#8A651E] transition-colors"
          />
        </div>
        <div className="text-[11px] text-gray-500 font-medium self-end sm:self-auto">
          Showing up to 100 recent entries
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-black/5">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Program</th>
                <th className="p-4">Message / Type</th>
                <th className="p-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingAppointments && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#8A651E]" />
                    <span>Fetching inquiry records...</span>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <span>{searchTerm ? 'No matching inquiries found.' : 'No inquiry records available.'}</span>
                  </td>
                </tr>
              ) : (
                filteredRows.map((r, idx) => {
                  const key = r.id || `${r.email || 'no-email'}-${r.created_at || idx}`;
                  const name = r.name || r.studentName || '—';
                  const email = r.email || '—';
                  const phone = r.phone || '—';
                  const program = r.program || r.targetExam || 'General Inquiry';
                  const message = r.message || r.notes || r.activity_type || 'Inquiry';

                  return (
                    <tr key={key} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 text-xs">{name}</div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="font-mono text-[11px]">{email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{phone}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-800">
                          <BookOpen className="w-3 h-3 text-[#8A651E]" />
                          <span>{program}</span>
                        </div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="text-gray-700 leading-relaxed line-clamp-2" title={message}>
                          {message}
                        </p>
                      </td>

                      <td className="p-4 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(r.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};