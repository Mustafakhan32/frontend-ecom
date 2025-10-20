import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Card from '../Components/Card';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import ProgressBar from '@/Components/ProgressBar';
import { useLocation } from 'react-router-dom';
import CategoryComponent from '@/Components/CategoryComponent';
import CartAndWishlist from '@/Components/CartAndWishlist';
import FeatureProduct from '@/Components/FeatureProduct';

export default function HomePage() {
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const location = useLocation();
    const [headlineIndex, setHeadlineIndex] = useState(0);
    const [showHeadlines, setShowHeadlines] = useState(false);
    const [fade, setFade] = useState("fade-in"); // CSS class for fade-in/fade-out

    const headlines = [
        'Limited Time Offer: 20% Off',
        'Free Shipping On Order Over Rs. 5000!'
    ];

    // UseEffect to simulate loading progress
    useEffect(() => {
        setProgress(0);
        const startProgress = setTimeout(() => setProgress(50), 50);
        const finishProgress = setTimeout(() => {
            setProgress(100);
        }, 300);

        return () => {
            clearTimeout(startProgress);
            clearTimeout(finishProgress);
        };
    }, [location]);

    // Show headlines after 6 seconds
    useEffect(() => {
        const showHeadlinesTimeout = setTimeout(() => {
            setShowHeadlines(true);
        }, 9000); // 6 seconds delay

        return () => clearTimeout(showHeadlinesTimeout); // Cleanup on unmount
    }, []); // Empty dependency array to run once on mount

    // Cycle through headlines every 3 seconds with fade effect
    useEffect(() => {
        if (showHeadlines) {
            const interval = setInterval(() => {
                setFade("fade-out"); // Trigger fade-out
                setTimeout(() => {
                    setHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
                    setFade("fade-in"); // Trigger fade-in
                }, 500); // Wait for fade-out to complete before switching headline
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [showHeadlines]);
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
        <div className="w-full min-h-screen bg-gray-200 flex flex-col">
            <ProgressBar progress={progress} />

            {/* Dynamic Headline Section */}
            {showHeadlines && (
                <div className="bg-white text-black text-center py-2 overflow-hidden relative">
                    <button
                        onClick={() => setShowHeadlines(false)}
                        className="absolute top-1 right-5 text-2xl text-gray-600 hover:text-gray-900 font-extrabold"
                    >
                        &times;
                    </button>
                    <p className={`text-lg font-bold text-headline whitespace-nowrap transition-all duration-500 ${fade}`}>
                        {headlines[headlineIndex]}
                    </p>
                </div>
            )}

            <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
            <Hero />
            <div className="flex-grow bg-gray-200 container mx-auto h-full mb-4">
                <CategoryComponent />
                <FeatureProduct />
                <Card />
            </div>
            <Footer />
            <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />
        </div>
    );
}
