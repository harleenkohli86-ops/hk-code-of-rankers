import React, { useState } from 'react';
import {
  DiscountCodeRecord,
  addCustomDiscountCode,
  toggleDiscountCodeStatus,
  resetOrDeleteDiscountCode,
} from '../../services/centralStudentDatabase';
import {
  Tag,
  Copy,
  Check,
  CheckCircle2,
  Search,
  Plus,
  Trash2,
  RotateCcw,
  Power,
} from 'lucide-react';

interface DiscountCodesTabProps {
  discountCodes: DiscountCodeRecord[];
}

export const DiscountCodesTab: React.FC<DiscountCodesTabProps> = ({ discountCodes = [] }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('all');
  const [search, setSearch] = useState('');

  // Create Code Form State
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState<number>(15);
  const [isMultiUse, setIsMultiUse] = useState(false);
  const [usageLimit, setUsageLimit] = useState(1);
  const [creationToast, setCreationToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const unusedCount = discountCodes.filter((c) => !c.isUsed && c.isActive !== false).length;
  const usedCount = discountCodes.filter((c) => c.isUsed).length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const limitToPass = isMultiUse ? undefined : usageLimit;
    const res = await addCustomDiscountCode(newCode.trim(), newPercent, isMultiUse, limitToPass);
    
    setCreationToast({ type: res.success ? 'success' : 'error', message: res.message });
    
    if (res.success) {
      setNewCode('');
      setUsageLimit(1);
      setIsMultiUse(false);
    }
    setTimeout(() => setCreationToast(null), 4000);
  };

  const handleToggleActive = async (code: string) => {
    await toggleDiscountCodeStatus(code);
  };

  const handleResetRedeemed = (code: string) => {
    if (window.confirm(`Reset redeemed status for ${code}? It will be ready for student checkout again.`)) {
      void resetOrDeleteDiscountCode(code, false);
    }
  };

  const handleDeleteCode = (code: string) => {
    if (window.confirm(`Permanently delete promo code ${code}?`)) {
      void resetOrDeleteDiscountCode(code, true);
    }
  };

  const filteredCodes = discountCodes.filter((c) => {
    if (filter === 'unused' && (c.isUsed || c.isActive === false)) return false;
    if (filter === 'used' && !c.isUsed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const studentName = c.usedByStudentName || '';
      const email = c.usedByEmail || '';
      const orderId = c.usedWithOrderId || '';
      return (
        c.code.toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#171512] to-[#0F0F0F] text-white border-2 border-[#C8A45D]/40 p-5 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 border border-[#C8A45D]/50 flex items-center justify-center text-[#FFE3A0] shrink-0">
            <Tag className="w-6 h-6 text-[#C8A45D]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#FFE3A0] tracking-wider flex items-center gap-1.5">
              <span>Security & Audit Control</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px]">
                Promo Management
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Ranker Promo Codes &amp; HK5 (Strict No-Stacking)
            </h2>
            <p className="text-xs text-gray-400">
              Manage 15% Ranker codes, 5% HK5 code, and custom vouchers. Only one coupon allowed per checkout order.
            </p>
          </div>
        </div>

        {/* Stats and Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#C8A45D] text-black shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All ({discountCodes.length})
          </button>
          <button
            onClick={() => setFilter('unused')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'unused'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Active & Available ({unusedCount})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'used'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Redeemed ({usedCount})
          </button>
        </div>
      </div>

      {/* Admin Creator Panel */}
      <div className="bg-white border border-[#C8A45D]/30 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#8A651E]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#0F0F0F] uppercase tracking-wider">
              Create New Promo / Voucher Code
            </h3>
          </div>
          <span className="text-[10px] text-gray-500">Case-insensitive • Instant Checkout Application</span>
        </div>

        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Coupon Code</label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="e.g. SPECIAL15"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-mono font-bold focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Usage Limit</label>
            <input
              type="number"
              min={1}
              value={usageLimit}
              disabled={isMultiUse}
              onChange={(e) => setUsageLimit(Math.max(1, Number(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#C8A45D] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Discount %</label>
            <select
              value={newPercent}
              onChange={(e) => setNewPercent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8A45D] cursor-pointer"
            >
              <option value={5}>5% Flat OFF</option>
              <option value={10}>10% Flat OFF</option>
              <option value={15}>15% Ranker Discount</option>
              <option value={20}>20% Flat OFF</option>
              <option value={25}>25% Special Discount</option>
            </select>
          </div>

          <div className="flex items-center sm:items-end pb-2">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isMultiUse}
                onChange={(e) => setIsMultiUse(e.target.checked)}
                className="w-4 h-4 text-[#C8A45D] rounded border-gray-300 focus:ring-[#C8A45D]"
              />
              <span className="font-medium text-[11px]">Multi-Use (Unlimited)</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!newCode.trim()}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#C8A45D] to-[#DFB96E] hover:brightness-105 disabled:opacity-40 text-black font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>
        </form>

        {creationToast && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              creationToast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {creationToast.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Tag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span>{creationToast.message}</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search promo code or student details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#C8A45D]"
          />
        </div>
      </div>

      {/* Discount Codes Grid / Table */}
      <div className="bg-white border border-[#C8A45D]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1C1917] text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Discount Code</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Redeemed By Student</th>
                <th className="py-3.5 px-4">Order ID &amp; Date</th>
                <th className="py-3.5 px-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs italic">
                    No promo codes found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCodes.map((c) => {
                  const isCopied = copiedCode === c.code;
                  const isMulti = c.code === 'HK5' || c.isPermanentMultiUse;
                  const isInactive = c.isActive === false;

                  return (
                    <tr
                      key={c.code}
                      className={`transition-colors hover:bg-gray-50/80 ${
                        isInactive
                          ? 'bg-gray-100/70 text-gray-400'
                          : c.isUsed && !isMulti
                          ? 'bg-gray-50/50 text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#FAF5E9] text-[#8A651E] px-2.5 py-1 rounded-lg border border-[#C8A45D]/40">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors cursor-pointer"
                            title="Copy promo code"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {isCopied && (
                          <span className="text-[10px] text-emerald-600 font-bold block pt-0.5">
                            Copied to clipboard!
                          </span>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 font-bold text-xs text-[#8A651E]">
                        <div>{c.discountPercent}% OFF Flat</div>
                        {isMulti && (
                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-semibold">
                            Multi-Use
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isInactive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700 border border-gray-300">
                            <span>Inactive (Paused)</span>
                          </span>
                        ) : c.isUsed && !isMulti ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-300">
                            <span>Redeemed (Locked)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active &amp; Available</span>
                          </span>
                        )}
                        {(c.usageCount || 0) > 0 && (
                          <div className="text-[9px] text-gray-500 mt-0.5">
                            Used: {c.usageCount} time{(c.usageCount || 0) > 1 ? 's' : ''}
                          </div>
                        )}
                      </td>

                      {/* Redeemed By */}
                      <td className="py-3.5 px-4">
                        {c.usedByStudentName ? (
                          <div>
                            <div className="font-bold text-gray-900 text-xs">
                              {c.usedByStudentName}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {c.usedByEmail || '—'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">
                            Unredeemed (Ready for use)
                          </span>
                        )}
                      </td>

                      {/* Order Details */}
                      <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                        {c.usedWithOrderId ? (
                          <div>
                            <div className="font-mono text-gray-800 text-[10px] font-bold">
                              {c.usedWithOrderId}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {c.usedAt
                                ? new Date(c.usedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleActive(c.code)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              isInactive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={isInactive ? 'Activate coupon' : 'Pause / deactivate coupon'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {c.isUsed && !isMulti && (
                            <button
                              onClick={() => handleResetRedeemed(c.code)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Reset code to unredeemed state"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCode(c.code)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Delete code"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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