import React from 'react';
import sizeabout from '../assets/sizeabout.svg';
import shippingabout from '../assets/shippingabout.svg';
import hangerabout from '../assets/hangerabout.svg';
import fireabout from '../assets/fireabout.svg';

const ProductQuality = () => {
    return (
        <div className="quality-section container mx-auto bg-gray-50 p-5 rounded-xl shadow-lg md:w-[162vh] mt-2 mb-6">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* High Quality Fabric */}
                <div className="quality-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img src={fireabout} width={100} height={100} className="mx-auto" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">High Quality Fabric</p>
                    <p className="text-gray-500">Crafted from premium materials for durability and comfort.</p>
                </div>

                {/* Eco-Friendly */}
                <div className="quality-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img src={hangerabout} width={100} height={100} className="mx-auto" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">Eco-Friendly</p>
                    <p className="text-gray-500">Our products are made with sustainable materials.</p>
                </div>

                {/* Fast Shipping */}
                <div className="quality-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img src={shippingabout} width={100} height={100} className="mx-auto" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">Fast Shipping</p>
                    <p className="text-gray-500">Within 3 to 5 working days you will get your order at your  door step.</p>
                </div>

                {/* Multiple Sizes */}
                <div className="quality-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img src={sizeabout} width={100} height={100} className="mx-auto" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">Multiple Sizes Available</p>
                    <p className="text-gray-500">Available in all sizes to fit every body type.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductQuality;
