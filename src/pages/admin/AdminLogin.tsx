import React, { useEffect, useState } from 'react';
import { AlertCircle, Eye, EyeOff, LockKeyhole, ShieldCheck, Loader2 } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { checkMasterAdminSlotStatus, loginMasterAdmin } from '../../lib/backend';
import { usePopup } from '../../context/PopupContext';

export const AdminLogin: React.FC = () => {
  const { setSession } = useAdmin();
  const { showSuccess } = usePopup();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    checkMasterAdminSlotStatus()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      const r = await loginMasterAdmin(form.email, form.password);
      if (!r.success || !r.session) throw new Error(r.message || 'Invalid administrator credentials.');
      setSession(r.session);
      setSuccess('Signed in successfully.');
      showSuccess(
        'Admin Login Successful',
        'Welcome back! Your Master Admin session is now active. All data has been synced securely.'
      );
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FAFAFA] text-gray-900">
        <Loader2 className="animate-spin h-6 w-6 text-[#C8A45D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] px-4 py-12 text-gray-900 sm:py-20 flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:grid-cols-[1fr_1.1fr]">
        
        {/* Left Branding Panel */}
        <div className="hidden bg-stone-900 p-10 lg:flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#C8A45D] text-stone-950 shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-cinzel font-bold tracking-wider text-sm">HK CODE OF RANKERS</p>
                <p className="text-xs text-stone-400 font-medium">Master Admin Portal</p>
              </div>
            </div>
          </div>
          <div className="my-auto py-10">
            <h1 className="font-cinzel text-4xl leading-tight font-medium text-stone-100">
              Private operations,<br />
              <span className="text-[#C8A45D]">cleanly separated.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone-300 font-light">
              Student records, payments, mentorship, inquiries, and promo controls live securely behind this authenticated workspace.
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Secure Encrypted Environment</p>
          </div>
        </div>

        {/* Right Form Container (Login Only) */}
        <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
          
          {/* Mobile Brand Header */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C8A45D] text-stone-950">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-cinzel font-bold text-sm">HK CODE OF RANKERS</p>
              <p className="text-xs text-stone-500">Master Admin</p>
            </div>
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A651E] bg-[#F7F2E8] px-2.5 py-1 rounded-md">
              Secure Sign In
            </span>
            <h2 className="mt-3 font-cinzel text-2xl font-bold text-stone-900">
              Admin Login
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter your credentials to manage operations.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field 
              label="Email Address" 
              type="email" 
              value={form.email} 
              onChange={v => setForm({ ...form, email: v })} 
              placeholder="admin@hkrankers.com" 
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-700">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  placeholder="••••••••"
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-3 pr-10 text-sm text-stone-900 outline-none transition-all focus:border-[#C8A45D] focus:bg-white focus:ring-4 focus:ring-[#C8A45D]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-700 font-medium">
                {success}
              </div>
            )}

            <button
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-900/10 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="animate-spin h-4 w-4 text-white" />
              ) : (
                <LockKeyhole className="h-4 w-4 text-[#C8A45D]" />
              )}
              <span>Sign In to Dashboard</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', required = true, placeholder = '' }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-stone-700">{label}</label>
    <div className="relative">
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-3 text-sm text-stone-900 outline-none transition-all focus:border-[#C8A45D] focus:bg-white focus:ring-4 focus:ring-[#C8A45D]/10"
      />
    </div>
  </div>
);