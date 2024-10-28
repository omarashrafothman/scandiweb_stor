import React from 'react';
import ReactDOM from 'react-dom/client';
import { ParamProvider } from './context/ParamContext'
import App from './App';
import { CartProvider } from './context/CartContext'
import './style/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ParamProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ParamProvider>

  </React.StrictMode>
);

