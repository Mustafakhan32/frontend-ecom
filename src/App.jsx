// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Product from './pages/Product';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchResults from './Components/SearchResult';
import PrivateRoute from './routes/Private';
import PageNotFound from './pages/PageNotFound';
import ProductMain from './pages/ProductMain';
import Cart from './pages/Cart';
import CheckoutComponent from './Components/CheckoutComponent';
import CategoryListing from './pages/CategoryListing';
import GoogleAuth from './routes/GoogleAuth';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google-auth" element={<GoogleAuth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product" element={<ProductMain />} />

        <Route path="/cart/checkout" element={<PrivateRoute />}>
          <Route path="" element={<CheckoutComponent />} />
        </Route>

        <Route path="/cart" element={<Cart />} />
        <Route path="/single-product/:slug" element={<Product />} />
        <Route path="/category/:slug" element={<CategoryListing />} />
        <Route path="/search/:keyword" element={<SearchResults />} />

        {/* Routes restricted to unauthenticated users */}
        <Route path="/forgot-password" element={<PrivateRoute guestOnly />}>
          <Route path="" element={<ForgotPassword />} />
        </Route>
        <Route path="/reset-password" element={<PrivateRoute guestOnly />}>
          <Route path="" element={<ResetPassword />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />

        <Route element={<PrivateRoute />}>
          <Route path="user" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
