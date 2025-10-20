import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CategoryComponent() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    const localstring = `https://backend-seprate.onrender.com`
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${localstring}/api/category/get-category`);
                if (response.data.success) {
                    setCategories(response.data.category);
                } else {
                    setError('Failed to fetch categories.');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching categories.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

        // On initial load, scroll to the leftmost point
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
        }

        const handleResize = () => {
            if (sliderRef.current) {
                sliderRef.current.scrollLeft = 0; // Ensure correct scroll on resize
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleScroll = (direction) => {
        if (direction === 'left') {
            sliderRef.current.scrollBy({
                left: -200,
                behavior: 'smooth',
            });
        } else {
            sliderRef.current.scrollBy({
                left: 200,
                behavior: 'smooth',
            });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Increase for faster scroll
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="mx-auto ">
            <h1 className="text-3xl font-sans text-center mt-4 text-gray-800">CATEGORIES</h1>

            {loading && <p className="text-center h-screen font-semibold text-xl">Loading Categories...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="relative flex items-center justify-center lg:justify-center"> {/* Centering logic */}
                <button
                    title='Left-Arrow'
                    className="absolute cat-btn left-5  lg:left-3 z-10 text-black p-2 rounded-full shadow-md hover:text-white hover:bg-black px-4 transition duration-300 ease-in-out lg:top-1/2 top-1/3 transform -translate-y-1/2"
                    onClick={() => handleScroll('left')}
                >
                    &#10094;
                </button>
                {/* Left Arrow */}

                {/* Categories Slider */}
                <div
                    className="flex overflow-x-auto space-x-4 p-4 scroll-smooth category-width font-normal sm:justify-normal lg:justify-center mx-auto hide-scrollbar" // Restrict width for better centering
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={(e) => handleMouseDown(e.touches[0])}
                    onTouchEnd={handleMouseLeaveOrUp}
                    onTouchMove={(e) => handleMouseMove(e.touches[0])}
                >

                    {categories.map((category) => (
                        <Link
                            to={`/category/${category.slug}`}
                            key={category._id}
                            title='Categories'
                            className="min-w-[110px] cat-comp text-center max-w-xs cursor-pointer rounded-lg overflow-hidden shadow-lg bg-gray-100 transition-transform hover:scale-105 flex-shrink-0"
                        >
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    title='Right-Arrow'
                    className="absolute cat-btn right-5 lg:right-3 z-10  text-black p-2 rounded-full shadow-md hover:text-white hover:bg-black px-4 transition duration-300 ease-in-out lg:top-1/2 top-1/3 transform -translate-y-1/2"
                    onClick={() => handleScroll('right')}
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
}
