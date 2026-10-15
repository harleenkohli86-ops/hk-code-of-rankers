import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { addStudentManually, getAllStudents, refreshAdminData, ProgramName, ProgramLevel, ProgramGroup } from '../../services/centralStudentDatabase';

const csvEscape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const BulkStudentsTab: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const downloadTemplate = () => {
    const rows = [
      ['fullName', 'email', 'phone', 'program', 'level', 'group', 'courseName', 'amount', 'utrNumber'],
      ['Student Name', 'student@example.com', '9876543210', 'CS Executive', 'Level 2', 'Group 1', 'CS Executive (Group 1) Mentorship', '2999', '']
    ];
    const blob = new Blob([rows.map(r => r.map(csvEscape).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'HK_students_bulk_template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const parse = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const parseLine = (line: string) => {
      const out: string[] = [];
      let cur = '', q = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; continue; }
        if (c === '"') { q = !q; continue; }
        if (c === ',' && !q) { out.push(cur.trim()); cur = ''; }
        else cur += c;
      }
      out.push(cur.trim());
      return out;
    };
    const head = parseLine(lines[0]).map(x => x.toLowerCase());
    return lines.slice(1).map(l => {
      const vals = parseLine(l);
      return Object.fromEntries(head.map((h, i) => [h, vals[i] || '']));
    });
  };

  const importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rows = parse(String(reader.result || ''));
        let added = 0, failed = 0;
        for (const r of rows) {
          const result = await addStudentManually({
            fullName: r.fullname || r.fullName,
            email: r.email,
            phone: r.phone,
            program: (r.program || 'CS Executive') as ProgramName,
            level: (r.level || 'Level 2') as ProgramLevel,
            group: (r.group || 'Group 1') as ProgramGroup,
            courseName: r.coursename || r.courseName || 'CS Mentorship',
            amount: Number(r.amount) || 0,
            utrNumber: r.utrNumber || r.utrnumber || '',
            initialPaymentStatus: 'unpaid'
          }, { skipRefresh: true, sendEmail: false });
          if (result.success) added++;
          else failed++;
        }
        await refreshAdminData();
        setMessage({
          ok: failed === 0,
          text: `Imported ${added} student${added === 1 ? '' : 's'}${failed ? `; ${failed} row${failed === 1 ? '' : 's'} skipped (duplicates/invalid)` : '.'}`
        });
        onRefresh();
      } catch (err: any) {
        setMessage({ ok: false, text: err?.message || 'Could not read the CSV file.' });
      } finally {
        setBusy(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const exportStudents = () => {
    const students = getAllStudents();
    const headers = ['studentId', 'fullName', 'email', 'phone', 'program', 'level', 'group', 'targetExam', 'registrationStatus', 'paymentStatus', 'mentorshipAccess', 'studyIndexAccess', 'registeredAt'];
    const body = students.map((s: any) => headers.map(h => csvEscape(s[h])).join(','));
    const blob = new Blob([[headers.join(','), ...body].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `HK_students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A651E] bg-[#F7F2E8] px-2.5 py-0.5 rounded-md">
            Bulk Operations
          </span>
          <h2 className="mt-1 font-cinzel text-xl font-bold text-stone-900">Import & Export Records</h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-stone-500">
            Validate required identity fields via CSV template upload or export all current records instantly.
          </p>
        </div>
        <button 
          onClick={downloadTemplate} 
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-300"
        >
          <FileSpreadsheet className="h-4 w-4 text-[#8A651E]" />
          <span>Download Template</span>
        </button>
      </div>

      {/* Action Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        {/* Import CSV Card */}
        <label className={`group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-4 transition-all hover:border-[#C8A45D] hover:bg-stone-50 ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C8A45D]/15 text-[#8A651E] transition-transform group-hover:scale-105">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-stone-900">Import CSV File</span>
            <span className="block text-[11px] text-stone-500 truncate">
              {busy ? 'Processing records...' : 'Upload filled student template'}
            </span>
          </div>
          <input disabled={busy} type="file" accept=".csv,text/csv" onChange={importFile} className="hidden" />
        </label>

        {/* Export Students Card */}
        <button 
          onClick={exportStudents} 
          className="group flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 text-left transition-all hover:border-[#C8A45D] hover:bg-stone-50/50 shadow-2xs"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C8A45D]/15 text-[#8A651E] transition-transform group-hover:scale-105">
            <Download className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-stone-900">Export All Students</span>
            <span className="block text-[11px] text-stone-500 truncate">Download operational records as CSV</span>
          </div>
        </button>

      </div>

      {/* Status Feedback Banner */}
      {message && (
        <div className={`mt-4 flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium animate-fadeIn ${
          message.ok ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          {message.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />}
          <span>{message.text}</span>
        </div>
      )}

    </section>
  );
};