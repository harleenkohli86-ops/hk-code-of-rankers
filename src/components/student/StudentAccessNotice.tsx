import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
export const StudentAccessNotice: React.FC<{ title: string; text: string; unlocked?: boolean }> = ({ title, text, unlocked }) => (
  <div className={`rounded-2xl border p-4 ${unlocked ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
    <div className="flex items-start gap-3"><div className="rounded-xl bg-white p-2">{unlocked ? <ShieldCheck className="h-5 w-5 text-emerald-600"/> : <Lock className="h-5 w-5 text-amber-600"/>}</div><div><p className="font-semibold text-gray-900">{title}</p><p className="mt-1 text-xs leading-5 text-gray-600">{text}</p></div></div>
  </div>
);
