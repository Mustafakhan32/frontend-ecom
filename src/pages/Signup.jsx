import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '@/Components/Footer';
import SignupContent from '@/Components/SignupContent';
import ProgressBar from '@/Components/ProgressBar'; // Import ProgressBar
import { useLocation } from 'react-router-dom';
import CartAndWishlist from '@/Components/CartAndWishlist';

export default function Signup() {
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
        <div className='w-full min-h-screen '>
            <ProgressBar progress={progress} /> {/* Add ProgressBar */}
            <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
            <div className="flex-grow">
                <SignupContent />
            </div>
            <Footer />

            <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />

        </div>
    );
}
