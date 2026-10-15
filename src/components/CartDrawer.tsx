import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    totalAmount,
    couponCode,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    setIsCheckoutModalOpen,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F0F] text-white shadow-2xl flex flex-col border-l border-[#C8A45D]/40">
          {/* Drawer Header */}
          <div className="p-5 bg-gradient-to-r from-[#1A1815] to-[#0F0F0F] border-b border-[#C8A45D]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <span>Your Mentorship Cart</span>
                  <span className="text-xs font-montserrat px-2 py-0.5 rounded-full bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 font-bold">
                    {cartItems.reduce((a, b) => a + b.quantity, 0)} Items
                  </span>
                </h2>
                <p className="text-[11px] text-gray-400 font-poppins">
                  HK Code of Rankers • Instant Course Enrollment
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8 text-[#C8A45D]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-cinzel text-lg font-bold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Explore our CS Mentorship Batches and Evaluated Test Series to add items to your cart.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black text-xs font-montserrat font-bold rounded-full shadow-md hover:brightness-110 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 bg-white/5 border border-[#C8A45D]/20 hover:border-[#C8A45D]/50 rounded-2xl space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#C8A45D]">
                          {item.product.category}
                        </span>
                        {item.product.selectedProgram && (
                          <span className="text-[9px] bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 px-1.5 py-0.2 rounded font-bold uppercase">
                            {item.product.selectedProgram}
                          </span>
                        )}
                      </div>
                      <h4 className="font-cinzel text-sm font-bold text-white leading-snug">
                        {item.product.name}
                      </h4>

                      {/* Display Selected Subjects List if Available */}
                      {item.product.selectedSubjects && item.product.selectedSubjects.length > 0 && (
                        <div className="pt-1">
                          <div className="text-[10px] font-semibold text-gray-400 mb-1">
                            Audited Subjects ({item.product.selectedSubjects.length} × ₹699/sub):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.product.selectedSubjects.map((sub, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] bg-black/60 text-gray-200 border border-white/10 px-2 py-0.5 rounded-md"
                              >
                                ✓ {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-2 font-montserrat">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#FFE3A0] font-montserrat">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}/-
                      </div>
                      <div className="text-[10px] text-gray-400 line-through">
                        ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}/-
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Order Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#141210] border-t border-[#C8A45D]/30 space-y-4">
              {/* Coupon Code Section */}
              <div className="space-y-2">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-montserrat">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>
                        Coupon <strong>{couponCode}</strong> applied ({discountPercentage}% OFF)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Coupon code (e.g. NEXT5)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 uppercase tracking-wider focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Offer Notice Chip */}
                    <div className="flex items-center justify-between p-2 bg-[#C8A45D]/15 border border-[#C8A45D]/40 rounded-xl text-[11px] gap-2">
                      <span className="text-[#FFE3A0] font-medium flex items-center gap-1.5 leading-tight">
                        <Sparkles className="w-3 h-3 text-[#C8A45D] shrink-0" />
                        <span>1st 10 got their offers! Next: <strong>5% OFF</strong> on Mentorship</span>
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await applyCoupon('NEXT5');
                          setCouponMessage({ type: res.success ? 'success' : 'error', text: res.message });
                        }}
                        className="px-2.5 py-1 bg-[#C8A45D] hover:bg-[#FFE3A0] text-black font-extrabold text-[10px] rounded-md transition-all cursor-pointer font-montserrat shrink-0"
                      >
                        APPLY 5%
                      </button>
                    </div>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-[11px] font-poppins ${
                      couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-poppins border-t border-white/10 pt-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-montserrat">₹{subtotal.toLocaleString('en-IN')}/-</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-montserrat">-₹{discountAmount.toLocaleString('en-IN')}/-</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-white font-montserrat pt-2 border-t border-white/10">
                  <span>Total Paorble</span>
                  <span className="text-[#FFE3A0] text-base">₹{totalAmount.toLocaleString('en-IN')}/-</span>
                </div>
              </div>

              {/* Security Shield Banner */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 text-[10px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#C8A45D] shrink-0" />
                <span>100% Secure Direct UPI Payment • Verified Payee: Harkiran Kaur (AIR 3)</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-xl shadow-lg shadow-[#C8A45D]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Proceed to UPI Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
