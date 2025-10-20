import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext'; // Update with actual path

export default function CartComponent() {
    const {
        cartItems,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemSize,
        updateCartItemFabric,
        updateCartItemColor,
    } = useCart();

    const increaseQuantity = (item) => {
        const newQuantity = (item.quantity || 0) + 1;
        if (newQuantity <= 100) {
            updateCartItemQuantity(item._id, newQuantity);
        }
    };

    const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateCartItemQuantity(item._id, item.quantity - 1);
        }
    };

    const handleQuantityChange = (e, item) => {
        let value = Math.min(Math.max(Number(e.target.value.replace(/[^0-9]/g, '')), 1), 100);
        e.target.value = value;
        updateCartItemQuantity(item._id, value);
    };

    const grandTotal = cartItems.reduce((total, item) => total + item.total, 0);

    return (
        <div className="p-4 container mx-auto">

            {cartItems.length === 0 ? (
                <>
                    <p className='mb-4 mt-52  font-sans font-medium text-center'>Your Cart Is Empty</p>
                    <Link className='flex justify-center w-40  mx-auto bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out' to={'/'} >Go Back To Home</Link>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-sans text-center mb-5">Your Cart</h1>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                        {cartItems.slice().reverse().map((item) => (
                            <li key={item._id} className="border rounded-lg shadow-md p-2 flex flex-col lg:flex-row bg-gray-100">
                                {/* Product Image */}
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full lg:w-1/2 h-96 mt-5 rounded-md object-cover"
                                />

                                {/* Product Details */}
                                <div className="flex flex-col justify-between w-full lg:w-1/2 p-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold">{item.name}</h4>
                                        <button onClick={() => removeFromCart(item._id)} className="text-black hover:bg-black transition-colors duration-200 hover:text-white rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className='text-lg font-semibold'>Rs. {item.price}</p>

                                    <div className="flex flex-col space-y-2 mt-2">
                                        {/* Size Dropdown */}
                                        <div>
                                            <h3 className="font-medium">Size</h3>
                                            <select
                                                value={item.selectedSize || ''}
                                                onChange={(e) => updateCartItemSize(item._id, e.target.value)}
                                                className="border border-gray-200 rounded p-2 h-10"
                                            >
                                                <option value="" disabled>Select Size</option>
                                                {Object.keys(item.sizes || {}).map((size) => (
                                                    item.sizes[size] && (
                                                        <option key={size} value={size}>{size}</option>
                                                    )
                                                ))}
                                            </select>
                                        </div>

                                        {/* Quantity Controls */}
                                        <h3 className="font-medium">Quantity</h3>
                                        <div className="flex items-center border border-gray-200 rounded w-32 h-10">
                                            <button onClick={() => decreaseQuantity(item)} className="px-2 py-2 bg-black text-white rounded-l hover:bg-slate-700 transition-all duration-300 ease-in-out">&#8722;</button>
                                            <input
                                                type="text"
                                                disabled
                                                className="w-20 text-center border-0 outline-none h-full"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(e, item)}
                                                maxLength={3}
                                            />
                                            <button onClick={() => increaseQuantity(item)} className="px-2 py-2 bg-black text-white rounded-r hover:bg-slate-700 transition-all duration-300 ease-in-out ">&#43;</button>
                                        </div>

                                        {/* Fabric Dropdown */}
                                        <div>
                                            <h3 className="font-medium">Fabrics</h3>
                                            <select
                                                className="border border-gray-200 rounded p-2 h-10"
                                                value={item.selectedFabric || ''}
                                                onChange={(e) => updateCartItemFabric(item._id, e.target.value)}
                                            >
                                                <option value="" disabled>Select Fabric</option>
                                                {item.fabrics?.map((fabric, index) => (
                                                    <option key={index} value={fabric.trim()}>{fabric.trim()}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Color Selection */}
                                        <div>
                                            <h3 className="font-medium">Select Color:</h3>
                                            <div className="flex space-x-2 mt-1">
                                                {item.colors?.map((color) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => updateCartItemColor(item._id, color)}
                                                        className={`w-7 h-7 rounded-full cursor-pointer border-2 ${item.color === color ? 'border-black border-4' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <p className='mt-2 text-lg font-bold'>Total Rs. {item.total}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Grand Total and Checkout Button Container */}
                    <div className="flex flex-col items-center mt-0 mb-4 w-full  mx-auto">
                        {/* Checkout Button */}
                        <Link
                            to="/cart/checkout"
                            className="mt-8 mb-4 bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out"
                        >
                            Proceed to Checkout
                        </Link>


                    </div>
                </>
            )}
        </div>
    );
}
