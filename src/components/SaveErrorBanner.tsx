import React, { useEffect, useState } from 'react';

/** Red banner shown when a background save to the database fails (see reportSaveError). */
export const SaveErrorBanner: React.FC = () => {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const onErr = (e: Event) => {
      setMsg(String((e as CustomEvent).detail || 'Could not save changes.'));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(null), 8000);
    };
    window.addEventListener('hk-save-error', onErr);
    return () => {
      window.removeEventListener('hk-save-error', onErr);
      window.clearTimeout(timer);
    };
  }, []);

  if (!msg) return null;
  return (
    <div role="alert" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] max-w-md w-[92%] bg-red-600 text-white text-sm rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3">
      <span className="flex-1">⚠️ {msg}</span>
      <button onClick={() => setMsg(null)} className="font-bold" aria-label="Close">×</button>
    </div>
  );
};
