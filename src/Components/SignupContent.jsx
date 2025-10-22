import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupContent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        role: 0, // Default role is set to '0' for normal user
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate inputs on change
        if (!value) {
            setErrors((prev) => ({ ...prev, [name]: 'This field is required.' }));
        } else {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev; // Remove error for this field if exists
                return rest;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!formData.name) newErrors.name = 'Name is required.';

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        // Validate phone
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be numeric.';
        }

        // Validate address
        if (!formData.address) newErrors.address = 'Address is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const localstring3 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`

    const localstring = `https://backend-ecom-mfns.onrender.com`


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false); // Stop loading if validation fails
            return;
        }

        try {
            const response = await axios.post(`${localstring}/api/user/signup`, formData);
            if (response && response.data.success) {
                toast.success('Signup Successful');
                setLoading(false);

                setTimeout(() => {
                    navigate('/login');
                }, 1100); // Change 1500 to your desired delay in milliseconds
            }
        } catch (error) {
            setLoading(false);
            toast.error('Signup Failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 relative bg-cover bg-center"
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-65"></div>

            {/* Form Container */}
            <div className="relative z-10 bg-white bg-opacity-65 rounded-lg shadow-lg p-8 space-y-6 w-full max-w-md">
                <h2 className="text-3xl font-sans text-center text-gray-800">Sign Up</h2>

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">User Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'
                            }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'
                            }`}
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
                        className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'
                            }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Contact Number Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'
                            }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                {/* Address Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border rounded-md p-2 focus:outline-none transition duration-200 ${errors.address ? 'border-red-500' : 'border-gray-300 focus:ring focus:ring-black'
                            }`}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="container mx-auto bg-black text-white active:text-white active:bg-slate-700 hover:bg-slate-700 transition-colors px-4 py-2 rounded-sm"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>

                {/* Link to Login Page */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?&nbsp;<Link to={'/login'} className="text-black font-semibold hover:underline">Log In</Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
