import React, { useState, useEffect } from 'react';
import { useAuth } from "../store/Auth";
import { Outlet, useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import axios from 'axios';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import CartAndWishlist from '@/Components/CartAndWishlist';

export default function PrivateRoute({ guestOnly = false }) {
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const navigate = useNavigate();

    const localstring1 = `http://localhost:8000`
    const localstring2 = `https://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    const localstring = `https://backend-seprate.onrender.com`;

    useEffect(() => {
        if (cartOpen || wishOpen) {
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        } else {
            document.body.style.overflow = 'auto'; // Allow body scroll
        }
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [cartOpen, wishOpen]);


    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(`${localstring}/api/user/user-auth`, {
                    headers: {
                        "Authorization": `Bearer ${auth?.token}`
                    }
                });

                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                setOk(false);
            } finally {
                setLoading(false);
            }
        };

        if (auth?.token) {
            authCheck();
        } else {
            setLoading(false);
        }
    }, [auth?.token]);

    useEffect(() => {
        // Redirect if user is authenticated and guestOnly is true
        if (guestOnly && ok) {
            navigate('/user'); // Redirect to profile or other relevant page
        }
    }, [guestOnly, ok, navigate]);

    if (loading) return <Spinner />;

    // Unauthorized message if not authenticated for routes that require login
    if (!ok && !guestOnly) {
        return (
            <>
                <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                    <div className="bg-gray-100 shadow-lg rounded-lg p-8 max-w-lg text-center">
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-lg text-gray-700 mb-8">You are not authorized to view this page.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-black active:text-white active:bg-slate-800 text-white rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out"
                        >
                            Go Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
                <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />
            </>
        );
    }

    return <Outlet />;
}
