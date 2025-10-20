import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './store/Auth.jsx'
import { CartProvider } from './store/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
)
