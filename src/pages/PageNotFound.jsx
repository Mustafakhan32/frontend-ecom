import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Header from '../Components/Header';
import Footer from '@/Components/Footer';
import ProgressBar from '@/Components/ProgressBar'; // Import ProgressBar
import { useLocation } from 'react-router-dom';
import CartAndWishlist from '@/Components/CartAndWishlist';

export default function PageNotFound() {
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [progress, setProgress] = useState(0); // Progress state
    const location = useLocation();

    // Progress logic for page load
    useEffect(() => {
        setProgress(0);

        const startProgress = setTimeout(() => setProgress(50), 50);
        const finishProgress = setTimeout(() => setProgress(100), 400);

        return () => {
            clearTimeout(startProgress);
            clearTimeout(finishProgress);
        };
    }, [location]);


    const navigate = useNavigate(); // Get navigate function for navigation

    const handleGoHome = () => {
        navigate('/'); // Navigate to home page
    };
    useEffect(() => {
        if (cartOpen || wishOpen) {
            // Add a class to the body to prevent scrolling
            document.body.classList.add('no-scroll');
        } else {
            // Remove the class when cart or wishlist is closed
            document.body.classList.remove('no-scroll');
        }

        return () => {
            // Cleanup to ensure no residual class
            document.body.classList.remove('no-scroll');
        };
    }, [cartOpen, wishOpen]);

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-100">
            <ProgressBar progress={progress} /> {/* Add ProgressBar */}

            <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Sorry, the page you are looking for does not exist.
                </p>
                <button
                    onClick={handleGoHome}
                    className="bg-black active:text-white active:bg-black text-white px-4 py-2 rounded-sm hover:bg-white hover:text-black transition duration-200"
                >
                    Go Back to Home
                </button>
            </div>
            <Footer />
            <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />

        </div>
    );
}
