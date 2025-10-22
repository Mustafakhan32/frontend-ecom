import React from 'react';

const AboutUs = () => {
    return (
        <div className="relative container mx-auto p-5 mt-8 mb-8 bg-gray-50 rounded-lg shadow-md">

            {/* Two Columns Container */}
            <div className="grid  grid-cols-1 md:grid-cols-1 gap-6">
                {/* Left Side - Image */}
                <div className="relative w-full min-h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
                    <div
                        style={{ backgroundColor: '#0b0b15' }}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    ></div>

                    {/* Overlayed Business Description */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-start items-start p-4 md:p-6 text-white rounded-lg">
                        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 mt-2">About Us</h1>
                        <p className="text-sm md:text-lg leading-relaxed mb-2">
                            Welcome to <span className="font-bold">NR</span>, your premier
                            <span className="font-semibold"> Clothing Boutique Store</span>. where fashion meets individuality. At NR, we believe clothing is more than just fabric—it's a statement of who you are. Our carefully curated collections blend timeless style with modern trends, offering high-quality apparel for those who value comfort, confidence, and self-expression. <br /><br />
                            Whether you're dressing for everyday life or a special occasion, NR delivers versatile and stylish pieces designed to fit seamlessly into your lifestyle. With a focus on craftsmanship, sustainability, and customer satisfaction, we're here to help you look and feel your best—every single day.
                            and a refined look that resonates with confidence. <br /><br />
                        </p>

                        <p className="text-md md:text-xl leading-relaxed mb-2">
                            Founded in <span className="font-semibold">2022</span> by <span className="font-semibold">NR – Wear Your Confidence.</span>.
                        </p>
                    </div>
                </div>




                {/* Contact Form */}
                {/* <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Get In Touch
                    </h2>
                    <p className="text-md text-gray-600">
                        We’d love to hear from you. Please fill out the form below to reach us.
                    </p>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Subject"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
                        />

                        <textarea
                            placeholder="Your Message"
                            className="border border-gray-300 rounded-lg p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
                        />

                        <button
                            className="bg-black text-white py-3 px-6 w-full rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300 ease-in-out"
                        >
                            Send Message
                        </button>
                    </form>
                </div> */}
            </div>
        </div>
    );
};

export default AboutUs;
