// pages/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

// import CartAndWishlist from '@/Components/CartAndWishlist';

const ResetComponent = () => {
    const [formData, setFormData] = useState({
        email: '',
        resetCode: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state?.fromForgotPassword) {
            navigate('/forgot-password'); // Redirect if not from Forgot Password
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // const token = new URLSearchParams(window.location.search).get('token');
            const response = await axios.post(`https://backend-ecom-mfns.onrender.com/api/user/reset-code-password`, {
                ...formData 
            });

            if (response.data.success) {
                toast.success('Password reset successfully. You can now log in.');
                navigate('/login');
            } else {
                toast.error('Error resetting password.');
            }
        } catch (error) {
            toast.error('Error resetting password. Please try again.');
            console.error('Reset Password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            
            <div className="min-h-screen flex flex-col bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
                }}>
                <div className="absolute inset-0 bg-black opacity-65"></div>
                <div className="flex-grow flex items-center justify-center relative z-10 p-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg bg-opacity-65 shadow-lg p-8 space-y-6 w-full max-w-md">
                        <h2 className="text-3xl font-sans text-center">Reset Password</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border rounded-md p-2 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Code</label>
                            <input
                                type="text"
                                name="resetCode"
                                value={formData.resetCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border rounded-md p-2 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border rounded-md p-2 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="container mx-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetComponent;
