import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/Auth';
import axios from 'axios';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function UserProfile() {
    const [auth, setAuth] = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();
    const [errors, setErrors] = useState({}); // State to hold validation errors

    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`

    const localstring = `https://backend-seprate.onrender.com`;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        if (auth?.user) {
            setFormData({
                name: auth.user.name || '',
                email: auth.user.email || '',
                password: '',
                phone: auth.user.phone || '',
                address: auth.user.address || ''
            });
        }
    }, [auth]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${localstring}/api/user/orders`, {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                });
                if (response.data) {
                    setOrders(response.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error when user types

    };
    const validateForm = () => {
        const newErrors = {};
        const { name, email, password, phone } = formData;

        if (!name) newErrors.name = 'Name is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (password && password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (phone && !/^\d{11}$/.test(phone)) { // Adjust the regex as per your phone number format
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Only proceed if validation passes

        try {
            const response = await axios.put(`${localstring}/api/user/profile-edit`, formData, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
            });
            if (response.data.success) {
                // Update auth state with only desired fields
                const updatedUser = response.data.updateUser;
                setAuth((prevAuth) => ({
                    ...prevAuth,
                    user: {
                        ...prevAuth.user,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        phone: updatedUser.phone,
                        address: updatedUser.address,
                        // Add any other fields you want to keep here
                    }
                }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Determine if the user logged in with Google
    const loggedInWithGoogle = !!auth?.user?.googleId;

    return (
        <>
          <div className="container mx-auto py-5 px-2 min-h-screen bg-gray-200">
    <div className="flex flex-col items-center gap-8">

        {/* User Profile Section */}
        <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
            {loggedInWithGoogle && <h3 className="font-sans mb-2">You Are Signed In With Google</h3>}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    {!loggedInWithGoogle && (
                        <>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-4 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Name"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </>
                    )}

                    {!loggedInWithGoogle && (
                        <>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-4 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Email"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </>
                    )}

                    {!loggedInWithGoogle && (
                        <>
                            <input 
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-4 p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </>
                    )}

                    {!loggedInWithGoogle && (
                        <>
                            <input 
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`mt-4 p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="Contact Number"
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </>
                    )}

                    {!loggedInWithGoogle && (
                        <input 
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-4 p-2 border border-gray-300 rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Address"
                        />
                    )}

                    <div className="mt-6 flex gap-4">
                        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-gray-800">Name: {auth?.user.name}</h2>
                    <p className="mt-2 text-gray-600">Email: {auth?.user.email}</p>

                    {!loggedInWithGoogle && (
                        <>
                            <p className="mt-2 text-gray-600">Phone Number: {auth?.user.phone}</p>
                            <p className="mt-2 text-gray-600">Address: {auth?.user.address}</p>
                        </>
                    )}

                    {!loggedInWithGoogle && (
                        <div className="mt-6">
                            <button onClick={() => setIsEditing(true)} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Orders Section */}
        <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Your Orders</h2>
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-center">
                                {['Order ID', 'Order Status', 'Shipping Price', 'Grand Total', 'Payment Method', 'Order Date', 'Product Name', 'Product Image', 'Selected Size', 'Selected Color', 'Selected Fabric', 'Product Quantity', 'Product Price'].map(header => (
                                    <th key={header} className="py-2 px-4 text-gray-600">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="cursor-pointer">
                            {orders.map((order) =>
                                order.products.map((product, index) => (
                                    <tr key={`${order._id}-${index}`} className="text-center">
                                        {index === 0 && (
                                            <>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>{order._id.slice(-4)}</td>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>{order.status}</td>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>Rs. {order.shipping}</td>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>Rs. {order.total}</td>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>{order.paymentMethod}</td>
                                                <td className="py-2 px-4 font-bold text-gray-700" rowSpan={order.products.length}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </>
                                        )}
                                        <td className="py-2 px-4 font-bold text-gray-700">{product.name}</td>
                                        <td className="py-2 px-4 flex justify-center items-center text-gray-700">
                                            {product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} className="h-28 w-20 rounded-md object-cover" />
                                            ) : (
                                                <span>No image</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 font-bold text-gray-700">{product.selectedSize || 'N/A'}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.selectedColor }}></div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 font-bold text-gray-700">{product.selectedFabric || 'N/A'}</td>
                                        <td className="py-2 px-4 font-bold text-gray-700">{product.quantity}</td>
                                        <td className="py-2 px-4 font-bold text-gray-700">Rs. {product.total}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 font-sans">You have no orders yet.</p>
            )}
        </div>
    </div>
</div>

        </>
    );
}
