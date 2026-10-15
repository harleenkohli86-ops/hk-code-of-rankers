import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { PopupProvider } from './context/PopupContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopupProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </PopupProvider>
  </StrictMode>,
);

