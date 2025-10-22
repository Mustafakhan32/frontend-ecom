import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [startTouch, setStartTouch] = useState(0);  // Track initial touch position
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef(null);

    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    
    const localstring = `https://backend-ecom-mfns.onrender.com`
    useEffect(() => {
        // Fetch slides from the backend API
        const fetchSlides = async () => {
            try {
                const response = await axios.get(`${localstring}/api/product/get-hero`); // Your backend API endpoint
                if (response.data.success) {
                    // Flatten the hero slides with all images into separate slide objects
                    const fetchedSlides = response.data.heroSlides.flatMap(slide =>
                        slide.image.map(img => ({
                            image: img,
                            title: slide.titles,
                            description: slide.descriptions
                        }))
                    );
                    setSlides(fetchedSlides);
                } else {
                    console.error('Error fetching slides');
                }
            } catch (error) {
                console.error('Error fetching slides', error);
            }
        };
        fetchSlides();
    }, []);

    const handleTouchStart = (e) => {
        setStartTouch(e.touches[0].clientX);  // Capture initial touch X position
    };

    const handleTouchMove = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const swipeDistance = startTouch - touchEnd;

        if (!isTransitioning) {
            if (swipeDistance > 50) {  // Swipe left
                nextSlide();
            } else if (swipeDistance < -50) {  // Swipe right
                prevSlide();
            }
        }
    };

    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        resetAutoSlide();
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
        resetAutoSlide();
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const startAutoSlide = () => {
        intervalRef.current = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(intervalRef.current);
        startAutoSlide();
    };

    useEffect(() => {
        if (slides.length > 0) {
            startAutoSlide();
        }
        return () => clearInterval(intervalRef.current);
    }, [slides]);

    return (
        <div
            className="relative mt-5 container mx-auto text-center hero-card w-full h-[85vh] md:h-[80vh] lg:h-[87vh] flex items-center justify-center bg-black overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchMove}
        >
            {slides.length > 0 && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${slides[currentSlide].image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Overlay for better text contrast */}
                    <div className="bg-black bg-opacity-35 h-full w-full flex flex-col items-center justify-center p-4 space-y-6">
                        {/* Title with better scaling */}
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-200 drop-shadow-md">
                            {slides[currentSlide].title}
                        </h1>
                        {/* Description text */}
                        <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 drop-shadow-sm">
                            {slides[currentSlide].description}
                        </p>
                        {/* Call to Action Button */}
                        <button
                            onClick={() => {
                                const targetElement = document.getElementById('featured-products');
                                if (targetElement) {
                                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                                    const offsetPosition = targetPosition - 85; // Adjust this value to change the scroll position

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                } else {
                                    console.error('Target element not found');
                                }
                            }}
                            className="inline-block px-4 py-2 mt-4 sm:text-xl md:text-1xl text-white bg-black hover:bg-slate-900 rounded-lg shadow-md transition-all duration-300"
                        >
                            Shop Now
                        </button>



                    </div>
                </div>
            )}

            {/* Slide indicator (dots) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 pb-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentSlide(index);
                            resetAutoSlide();
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-3 w-3 rounded-full transition-all duration-300 
                        ${currentSlide === index ? 'bg-white scale-110' : 'bg-gray-500'} 
                        hover:scale-125 hover:bg-white`}
                    />
                ))}
            </div>
        </div>

    );
};

export default Hero;
