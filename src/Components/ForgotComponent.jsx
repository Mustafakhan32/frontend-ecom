import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ForgotComponent = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('https://backend-ecom-mfns.onrender.com/api/user/forgot-password', { email });
            if (response.data.success) {
                toast.success('Password reset link sent to your email.');

                setTimeout(() => {
                    navigate("/reset-password", { state: { fromForgotPassword: true } });
                }, 1100); // Change 1500 to your desired delay in milliseconds

            } else {
                toast.error('Error sending email.');
            }
        } catch (error) {
            toast.error('Error sending email. Please try again.');
            console.error('Forgot Password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-center relative"
              >
                <div className="absolute inset-0 bg-black opacity-65"></div>
                <div className="flex-grow flex items-center justify-center relative z-10 p-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg bg-opacity-65 shadow-lg p-8 space-y-6 w-full max-w-md">
                        <h2 className="text-3xl font-sans text-center">Forgot Password</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full border rounded-md p-2 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="container mx-auto bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <ToastContainer />
                    </form>
                </div>
            </div>

        </>
    );
};

export default ForgotComponent;
