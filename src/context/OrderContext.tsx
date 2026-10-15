import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OrderItem } from '../types';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { apiGet, apiPost } from '../lib/api';
import { downloadInvoicePDF as downloadInvoicePdfFile, InvoiceResult } from '../services/invoiceService';
import { setCurrentStudent } from '../services/centralStudentDatabase';

interface OrderContextType {
  /** Logged-in student's orders — loaded from the database. */
  orders: OrderItem[];
  createOrder: (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'EMI',
    billingDetails: OrderItem['billingDetails'],
    options?: {
      utrNumber?: string;
    }
  ) => Promise<{ success: boolean; order?: OrderItem; message: string }>;
  refreshOrders: () => Promise<void>;
  latestOrder: OrderItem | null;
  isThankYouModalOpen: boolean;
  setIsThankYouModalOpen: (open: boolean) => void;
  /** Generates + downloads the official Tax Invoice PDF. Returns a result so the UI can report failures. */
  downloadInvoicePDF: (order: OrderItem) => InvoiceResult;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshSession } = useAuth();
  const { cartItems, subtotal, totalAmount, couponCode, clearCart } = useCart();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [latestOrder, setLatestOrder] = useState<OrderItem | null>(null);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    const r = await apiGet('/api/student/orders');
    if (r.ok) setOrders(r.data.orders || []);
  }, [user?.studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const createOrder = async (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'EMI',
    billingDetails: OrderItem['billingDetails'],
    options?: { utrNumber?: string }
  ): Promise<{ success: boolean; order?: OrderItem; message: string }> => {
    if (!user) return { success: false, message: 'Please login karke payment submit karein.' };
    if (cartItems.length === 0) return { success: false, message: 'Your cart is empty.' };
    if (paymentMethod !== 'UPI' || !options?.utrNumber) {
      return { success: false, message: 'Currently, only UPI payment (with UTR) is available.' };
    }

    const items = cartItems.map((ci) => ({
      productId: ci.product.id,
      name: ci.product.name,
      price: ci.product.price,
      quantity: ci.quantity,
    }));

    const r = await apiPost('/api/student/payments', {
      utrNumber: options.utrNumber,
      courseId: items[0]?.productId || 'cs-mentorship',
      courseName: items.map((i) => i.name).join(' + ') || 'CS Mentorship Batch',
      amount: subtotal,
      discountCode: couponCode || undefined,
      items,
      paymentProofNotes: `Direct UPI transfer submitted with UTR: ${options.utrNumber}`,
    });

    if (!r.ok || !r.data.order) {
      return { success: false, message: r.message || 'Payment could not be submitted. Please try again.' };
    }

    // Server (database) is the source of truth for amounts; keep the billing details the student typed.
    const order: OrderItem = {
      ...r.data.order,
      billingDetails: { ...r.data.order.billingDetails, ...billingDetails, email: r.data.order.billingDetails.email },
    };
    setLatestOrder(order);
    setOrders((prev) => [order, ...prev]);
    if (r.data.student) setCurrentStudent(r.data.student);
    void refreshSession();
    clearCart();
    setIsThankYouModalOpen(true);

    return {
      success: true,
      order,
      message: 'UTR number submitted! Your access will be unlocked after verification.',
    };
  };

  const downloadInvoicePDF = (order: OrderItem): InvoiceResult => {
    const result = downloadInvoicePdfFile(order);
    if (!result.success) console.error('Invoice download failed:', result.message);
    return result;
  };

  return (
    <OrderContext.Provider
      value={{ orders, createOrder, refreshOrders, latestOrder, isThankYouModalOpen, setIsThankYouModalOpen, downloadInvoicePDF }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
