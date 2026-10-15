import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { validateDiscountCode } from '../services/centralStudentDatabase';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  buyNow: (product: Product) => void;
  couponCode: string;
  discountPercentage: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  totalItemsCount: number;
  directCheckoutItem: Product | null;
  setDirectCheckoutItem: (product: Product | null) => void;
  updateProductInCart: (oldProductId: string, newProduct: Product) => void;
}

const CART_STORAGE_KEY = 'hk_rankers_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const updateProductInCart = (oldProductId: string, newProduct: Product) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === oldProductId
          ? { product: newProduct, quantity: 1 }
          : item
      )
    );
  };

  const buyNow = (product: Product) => {
    setDirectCheckoutItem(product);
    addToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const formatted = code.trim().toUpperCase();
    if (!formatted) return { success: false, message: 'Please enter a promo code.' };
    // The server (database) determines whether the code is valid.
    const check = await validateDiscountCode(formatted);
    if (check.valid) {
      setCouponCode(formatted);
      setDiscountPercentage(check.discountPercent);
      return { success: true, message: check.message };
    }
    return { success: false, message: check.message || 'Invalid promo code. Please enter a valid coupon code.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const totalAmount = Math.max(0, subtotal - discountAmount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        buyNow,
        couponCode,
        discountPercentage,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        totalAmount,
        totalItemsCount,
        directCheckoutItem,
        setDirectCheckoutItem,
        updateProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
