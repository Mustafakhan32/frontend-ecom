import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/Auth'; // Assuming the Auth context is here
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginContent() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:443`

    const localstring = `https://backend-ecom-mfns.onrender.com`;
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth(); // Get auth from Auth context

    const validateForm = () => {
        const newErrors = {};
        const { email, password } = formData;

        // Check for required fields
        if (!email) {
            newErrors.email = 'This field is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Email format validation
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'This field is required.';
        } else if (password.length < 6) { // Minimum password length validation
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Simple field validation on change
        if (!value) {
            setErrors((prev) => ({ ...prev, [name]: 'This field is required.' }));
        } else {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true while logging in
        setErrors({}); // Reset errors before each submission

        if (!validateForm()) {
            setLoading(false);
            return; // Stop if the form is invalid
        }

        const { email, password } = formData; // Destructure formData for easier access

        try {
            const response = await axios.post(`${localstring}/api/user/login`, { email, password });
            if (response.data) {
                setAuth({
                    ...auth,
                    user: response.data.user,
                    token: response.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(response.data));
                toast.success('Login Successful');

                setTimeout(() => {
                    navigate(location.state || "/");
                }, 1100); // Change 1500 to your desired delay in milliseconds
            }
        } catch (error) {
            setLoading(false); // Stop loading
            toast.error('Error logging in');
            console.error('Login error:', error); // Log the error for debugging
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${localstring}/api/user/google`;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success')) {
            toast.success('Google login successful');
            navigate("/");
        }
    }, [navigate]);

    // Check for user auth state and navigate accordingly
    // React.useEffect(() => {
    //     if (auth.user) {
    //         navigate("/");
    //     }
    // }, [auth.user, navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-cover bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-center relative">
            {/* Dark Overlay */}
            < div className="absolute inset-0 bg-black opacity-65" ></div >
            {/* Form Section */}
            < div className="flex-grow flex items-center justify-center relative z-10 p-6" >
                <form onSubmit={handleSubmit} className="bg-white rounded-lg bg-opacity-65 shadow-lg p-8 space-y-6 w-full max-w-md">
                    <h2 className="text-3xl font-sans text-center">Login</h2>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-between items-center mb-4">
                        <Link to="/forgot-password" className="text-sm text-black font-semibold hover:underline">Forgot Password?</Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="container mx-auto bg-black text-white active:text-white active:bg-slate-700 hover:bg-slate-700 transition-colors w-full px-4 py-2 rounded-sm"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    {/* <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="container mx-auto mt-4 bg-red-600 text-white active:bg-red-700 hover:bg-red-700 transition-colors w-full px-4 py-2 rounded-sm"
                    >
                        Login with Google
                    </button> */}
                    {/* Signup Link */}
                    <p className="text-sm text-center mt-4">
                        Don’t have an account? <Link to={'/signup'} className="text-black font-semibold hover:underline">Signup</Link>
                    </p>
                </form>
            </div >
            <ToastContainer />

        </div >
    );
}
