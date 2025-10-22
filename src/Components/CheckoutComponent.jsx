import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import ProgressBar from '@/Components/ProgressBar';
import { useLocation } from 'react-router-dom';
import { useCart } from '../store/CartContext'; // Import the useCart hook
import CartAndWishlist from './CartAndWishlist';
import { useAuth } from '@/store/Auth';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function CheckoutComponent() {
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const [shipping, setShipping] = useState('')
    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const localstring = `https://backend-ecom-mfns.onrender.com`
    const { cartItems, setCartItems, setWishlistItems, removeFromCart } = useCart(); // Include updateCartItemQuantity from context
    const [auth] = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        address1: '',
        country: '',
        city: '',
        postalCode: ''
    });
    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };
    const applyCoupon = () => {
        axios.post(`${localstring}/api/coupon/use-coupon`, { couponCode })
            .then(res => {
                if (res.data.success) {
                    alert('Coupon applied successfully!');
                    setDiscount(res.data.discount || 0); // Adjust based on response structure
                    setShipping(0); // Assuming coupon makes shipping free; adjust logic as needed
                } else {
                    alert(res.data.message || 'Failed to apply coupon');
                }
            })
            .catch(err => {
                console.error('Error applying coupon:', err);
                alert('Error applying coupon. Please try again.');
            });
    };


    useEffect(() => {
        if (auth?.user) {
            setFormData({
                name: auth.user.name || '',
                email: auth.user.email || '',
                password: auth.user.password || '',
                phone: auth.user.phone || '',
                address: auth.user.address || '',
                city: '',
                country: '',
                postalCode: '',
                address1: '',
            });
        }
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const orderData = {
            userId: auth?.user?._id, // Ensure the user ID is sent
            products: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                total: item.total,
                name: item.name,
                images: item.images,
                selectedSize: item.selectedSize,
                color: item.color,
                selectedFabric: item.selectedFabric
            })),
            total: grandTotal,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
            shipping: shipping,
            address1: formData.address1,
            paymentMethod: 'COD', // Adjust if needed
            purchaser: auth?.user?._id // Or a user object if needed by the backend
        };

        axios.post(`${localstring}/api/product/cod/payment`, orderData)
            .then(res => {
                if (res.data) {

                    toast.success('Order Placed Successfully');
                    setCartItems([]); // Clear cart items on logout
                    setWishlistItems([]); // Clear wishlist items on logout
                    localStorage.removeItem('cartItems');
                    localStorage.removeItem('wishlistItems');
                    // Delay navigation by 1-2 seconds (1000 to 2000 milliseconds)
                    setTimeout(() => {
                        navigate('/user');
                    }, 1400); // Change 1500 to your desired delay in milliseconds
                } else {
                    alert('Payment Failed');
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Fetch slides from the backend API
        const fetchShipping = async () => {
            try {
                const response = await axios.get(`${localstring}/api/product/get-hero`); // Your backend API endpoint
                if (response.data.success) {
                    const shippingPrice = parseFloat(response.data.heroSlides[0].shippingPrice);
                    setShipping(shippingPrice); // Update the shipping state

                    // Flatten the hero slides with all images into separate slide objects

                } else {
                    console.error('Error fetching slides');
                }
            } catch (error) {
                console.error('Error fetching slides', error);
            }
        };
        fetchShipping();
    }, []);

    useEffect(() => {
        setProgress(0);
        const startProgress = setTimeout(() => setProgress(50), 50);
        const finishProgress = setTimeout(() => setProgress(100), 400);

        return () => {
            clearTimeout(startProgress);
            clearTimeout(finishProgress);
        };
    }, [location]);

    // Calculate total price from cart items
    const totalPrice = cartItems.reduce((acc, item) => acc + item.total, 0);
    const grandTotal = totalPrice - discount + shipping;


    return (
        <>
            <ProgressBar progress={progress} />
            <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
            <div className="flex container mx-auto flex-col gap-4 md:flex-row bg-slate-900 mb-5 rounded-lg mt-5 text-white p-6">
                {/* Order Summary on Small Screens */}
                <div className="md:w-1/3 bg-slate-800 p-4 mb-6 text-black md:mb-0 rounded order-1 md:order-2">
                    <h2 className="text-xl text-white font-bold mb-4">Order Summary</h2>
                    {cartItems.slice().reverse().map((item, index) => (
                        <div key={index} className="flex text-white items-center hover:bg-gray-600 transition-colors rounded-md cursor-pointer pl-2 pt-2 pb-2 pr-1 justify-between mb-2">
                            <img src={item.images[0]} alt={item.name} className="w-20 h-28 object-cover rounded" />
                            <div className="flex-1 ml-2">
                                <h3 className="text-lg font-semibold">Name: {item.name}</h3>
                                <p className="text-sm text-white">Quantity: {item.quantity}</p>
                                <div className='flex gap-2'>
                                    <p className='text-sm text-white'>Color:</p>
                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} title={item.color}></span>
                                </div>
                                <p className="text-sm text-white">Fabrics: {item.selectedFabric}</p>
                                <p className="text-sm text-white">Size: {item.selectedSize}</p>
                            </div>
                            <span>Rs. {item.total.toFixed(2)}</span> {/* Update this to display the correct total */}
                            <button onClick={() => removeFromCart(item._id)} className="text-white transition-colors ml-2 hover:bg-black rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <div className="flex text-white justify-between font-bold mb-4">
                        <span>Total</span>
                        <span>Rs. {totalPrice.toFixed(2)}</span> {/* Ensure this reflects the total of all item totals */}
                    </div>
                    <div className="flex text-white justify-between mb-2">
                        <span>Shipping</span>
                        <span>{shipping}</span>
                    </div>
                    <div className="flex text-white justify-between font-bold mb-4">
                        <span>Grand Total</span>
                        <span>Rs. {grandTotal}</span> {/* Grand total reflecting all item totals */}
                    </div>

                    <div className="flex justify-between mb-4">
                        <input value={couponCode} onChange={handleCouponChange} type="text" placeholder="Discount code" className="w-2/3 p-2 border rounded-md focus:outline-none transition duration-200   text-black " />
                        <button onClick={applyCoupon} className="bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out">Apply</button>
                    </div>
                </div>
                {auth && (
                    <div className="flex-1 md:ml-0 order-2 md:order-1">
                        <h2 className="text-2xl font-bold mb-4">Delivery</h2>

                        <div className="flex mb-4">
                            <input type="text" name='name' value={formData.name} required
                                onChange={handleChange} placeholder="Your Name" className="w-full p-2  border  text-black rounded " />
                        </div>

                        <input
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            name='email'
                            required
                            placeholder="Your Email Address"
                            className="w-full p-2 mb-4  border  text-black rounded"
                        />
                        {/* Phone Number */}
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            name='phone'
                            placeholder="Phone"
                            className="w-full p-2 mb-4  border  text-black rounded"
                            readOnly
                        />

                        <input
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            name='address'
                            placeholder="Address"
                            className="w-full p-2 mb-4  border  text-black rounded"
                        />
                        <input
                            type="text"
                            value={formData.address1}
                            onChange={handleChange}
                            required
                            placeholder="Address1"
                            name='address1'
                            className="w-full p-2 mb-4  border  text-black rounded"
                        />

                        <input
                            placeholder='Country'
                            onChange={handleChange}
                            name='country'
                            required
                            value={formData.country}
                            className="w-full p-2 mb-4  border  text-black rounded" />

                        <div className="flex mb-4">
                            <input
                                type="text"
                                onChange={handleChange}
                                name='city'
                                required
                                value={formData.city}
                                placeholder="City"
                                className="w-1/2 p-2  border  text-black rounded mr-2"
                            />
                            <input
                                type="text"
                                onChange={handleChange}
                                required
                                name='postalCode'
                                value={formData.postalCode}
                                placeholder="Postal Code (Optional)"
                                className="w-1/2 p-2  border  text-black rounded mr-2"
                            />
                        </div>

                        <h2 className="text-2xl font-bold mb-4">Shipping method</h2>
                        <div className="flex justify-between mb-4">
                            <span>Standard Shipping</span>
                            <span className="text-white">{shipping}</span>
                        </div>
                        {/* 
                        <h2 className="text-2xl font-bold mb-4">Payment</h2>
                        <p className="mb-4">All transactions are secure and encrypted.</p>
                        <label className="flex items-center mb-4">
                            <input type="radio" name="payment" className="mr-2" />
                            Cash on Delivery (COD)
                        </label> */}

                        <button
                            onClick={handleSubmit}
                            className="bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white w-full transition-all duration-300 ease-in-out"
                        >
                            Complete order
                        </button>
                    </div>
                )}
            </div>
            <Footer />
            <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />
        </>
    );
}
