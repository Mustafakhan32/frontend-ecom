import React, { useState, useEffect } from 'react';
import insta from '../assets/in.svg';
import wa from '../assets/wa.svg';
import fb from '../assets/fb.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '@/store/Auth';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [auth, setAuth] = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(auth?.user?.newsletterSubscribed || false);

    // Function to handle subscription and unsubscription
    const handleSubscribeToggle = async () => {
        try {
            const endpoint = isSubscribed
                ? 'https://backend-ecom-mfns.onrender.com/api/user/unsubscribe-newsletter'
                : 'https://backend-ecom-mfns.onrender.com/api/user/subscribe-newsletter';

            const response = await axios.post(endpoint, {
                userId: auth?.user?._id,
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setIsSubscribed(!isSubscribed); // Toggle subscription status
                const updatedAuth = {
                    ...auth,
                    user: {
                        ...auth.user,
                        newsletterSubscribed: !isSubscribed,
                    },
                };
                setAuth(updatedAuth);
                localStorage.setItem('auth', JSON.stringify(updatedAuth)); // Persist auth state
                setEmail(''); // Clear the input field after success
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };

    // Effect to set the state based on auth changes (for when auth is reloaded)
    useEffect(() => {
        setIsSubscribed(auth?.user?.newsletterSubscribed || false);
    }, [auth]);
    return (
        <div>
            <footer style={{ backgroundColor: '#0b0b15' }} className="text-white py-6">
                <div className="mx-auto container px-1 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                    {/* Left Column: Business Info */}
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-lg font-semibold text-white">Business Information</h4>
                        <p>Business Name: Your Business</p>
                        <p>Email: info@yourbusiness.com</p>
                        <p>Phone: +123 456 789</p>
                    </div>

                    {/* Center Column: Newsletter Signup */}
                    <div className="text-center space-y-2">
                        <h4 className="text-lg font-semibold">Subscribe to Our Newsletter</h4>
                        <div className="flex justify-center items-center">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="px-1 py-2 rounded-l bg-gray-700 text-white focus:outline-none"
                                disabled={isSubscribed} // Disable input if already subscribed
                            />
                            <button
                                onClick={handleSubscribeToggle}
                                className="bg-black hover:bg-slate-800 transition-colors px-4 py-2 rounded-r text-white font-semibold"
                            >
                                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Social Media Icons */}
                    <div className="flex justify-center md:justify-end items-center space-x-1">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Facebook"
                            className="transition-transform duration-300 transform hover:scale-110"
                        >
                            <img width={19} height={19} src={fb} alt="Facebook" title="Facebook" />
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Instagram"
                            className="transition-transform duration-300 transform hover:scale-110"
                        >
                            <img width={37} height={37} src={insta} alt="Instagram" title="Instagram" />
                        </a>
                        <a
                            href="https://www.whatsapp.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="transition-transform duration-300 transform hover:scale-110"
                        >
                            <img width={23} height={23} src={wa} alt="WhatsApp" title="WhatsApp" />
                        </a>
                    </div>
                </div>

                {/* Footer Bottom Text */}
                <div className="mt-4 text-center text-sm text-gray-500">&copy; 2024 Your Business. All rights reserved.</div>
            </footer>
            <ToastContainer />
        </div>
    );
}
