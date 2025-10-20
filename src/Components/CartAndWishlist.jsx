import React from 'react';
import { useCart } from '../store/CartContext'; // Assuming CartContext is set up
import { Link } from 'react-router-dom';

const CartAndWishlist = ({ cartOpen, setCartOpen, wishOpen, setWishOpen }) => {
    const {
        cartItems,
        wishlistItems,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemColor,
        removeFromWishlist,
        updateCartItemSize,
        updateCartItemFabric,
        moveWishlistToCart
    } = useCart();

    const increaseQuantity = (item) => {
        updateCartItemQuantity(item._id, (item.quantity || 0) + 1);
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
        <>
            {/* Background Overlay */}
            {(cartOpen || wishOpen) && (
                <div
                    className={`fixed inset-0 bg-black z-20 transition-opacity duration-500 ${cartOpen || wishOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => { setCartOpen(false); setWishOpen(false); }}
                />
            )}

            {/* Cart Slider */}
            <div
                className={`fixed top-0 right-0 h-full width-cart shadow-lg bg-gray-100 z-30 transition-transform duration-300 ease-in-out transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'} ${cartOpen ? 'shadow-xl' : ''}`}
            >

                <div className="p-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Cart</h2>
                    <button onClick={() => setCartOpen(false)} className="text-black ml-2 hover:bg-white rounded-xl transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* <p className="mt-0 text-gray-800 font-semibold hover:underline">{product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}</p> */}

                <div className="p-2 overflow-y-auto h-[calc(100%-64px)] scrollable-container">
                    {cartItems.length === 0 ? (
                        <p className='mb-4 ml-1 font-sans font-medium'>Your Cart Is Empty</p>
                    ) : (
                        <ul>
                            {cartItems.slice().reverse().map((item) => (
                                <li key={item._id} className="flex items-start justify-between mb-4 border-b pb-2 rounded-md cursor-pointer  hover:bg-gray-200 transition-colors pr-2 pl-2 pt-2">
                                    <div className="flex items-start">
                                        <img src={item.images[0]} alt={item.name} className="w-40 h-96 rounded-md my-1 object-cover  mr-2" />
                                        <div className="flex flex-col justify-between h-full">
                                            <div>
                                                <h4 className="text-xl mb-1 font-bold">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h4>
                                                <p className='text-lg font-semibold'>Rs. {item.price}</p>
                                            </div>
                                            <div className="flex flex-col mt-2 space-y-2">
                                                {/* Size Dropdown */}
                                                <h3 className="font-medium">Size</h3>
                                                <select
                                                    value={item.selectedSize || ''}
                                                    onChange={(e) => updateCartItemSize(item._id, e.target.value)}
                                                    className="border border-gray-200 rounded p-2 w-full h-10"
                                                >
                                                    <option value="" disabled>Select Size</option>
                                                    {Object.keys(item.sizes).map((size) => (
                                                        item.sizes[size] && (
                                                            <option key={size} value={size}>{size}</option>
                                                        )
                                                    ))}
                                                </select>

                                                {/* Quantity Controls */}
                                                <h3 className="font-medium">Quantity</h3>
                                                <div className="flex items-center border border-gray-200 rounded h-[42px]">
                                                    <button onClick={() => decreaseQuantity(item)} className="px-2 py-2 bg-black text-white rounded-l hover:bg-slate-700 transition-all duration-300 ease-in-out">&#8722;</button>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        className="w-20 text-center border-0 outline-none bg-white h-full"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(e, item)}
                                                        maxLength={3}
                                                    />
                                                    <button onClick={() => increaseQuantity(item)} className="px-2 py-2 bg-black text-white  rounded-r hover:bg-slate-700 transition-all duration-300 ease-in-out ">&#43;</button>
                                                </div>

                                                {/* Fabrics Dropdown */}
                                                <div>
                                                    <h3 className="font-medium">Fabrics</h3>
                                                    <select
                                                        className="border border-gray-200 rounded p-2 w-full h-10"
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
                                                                className={`w-7 h-7 rounded-full cursor-pointer border-2 ${item.color === color ? 'border-black border-4 transition-colors' : 'border-transparent'}`}
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <p className='mt-0 text-lg font-bold'>Total Rs. {item.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="text-black hover:bg-white rounded-xl transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Grand Total */}
                    {cartItems.length > 0 && (
                        <div className="mt-2 mb-4 font-bold text-lg">
                            <span>Grand Total: </span>
                            <span>Rs. {grandTotal}</span>
                        </div>
                    )}

                    <Link to='/cart' className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out">Go To Cart</Link>
                </div>
            </div>

            {/* Wishlist Slider */}
            <div className={`fixed top-0 right-0 h-full width-cart bg-gray-100 shadow-lg z-30 transition-transform duration-300 ease-in-out transform ${wishOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Wishlist</h2>
                    <button onClick={() => setWishOpen(false)} className="text-black ml-2 hover:bg-white rounded-xl transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Move All to Cart Button */}
                <div className="p-4">
                    <button
                        onClick={moveWishlistToCart}
                        className="w-full py-2 bg-black text-white px-4  rounded-lg hover:bg-slate-700  transition-all duration-300 ease-in-out"
                    >
                        Move All to Cart
                    </button>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-128px)] scrollable-container">
                    {wishlistItems.length === 0 ? (
                        <p className='font-sans font-medium'>Your Wish List Is Empty</p>
                    ) : (
                        <ul className=''>
                            {wishlistItems.slice().reverse().map((item) => (
                                <li key={item._id} className="flex items-center rounded-md cursor-pointer justify-between hover:bg-gray-200  pl-2 pt-2 transition-colors mb-4 border-b pb-2 ">
                                    <div className="flex items-start ">
                                        <img src={item.images[0]} alt={item.name} className="w-24 h-32 rounded-md mr-2" />
                                        <div className="flex flex-col justify-between">
                                            <h4 className="text-lg font-semibold">{item.name}</h4>
                                            <p>{item.category.name}</p>
                                            <p className='text-lg font-semibold'>Rs. {item.price}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromWishlist(item._id)} className="text-black mr-1 hover:bg-white rounded-xl transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

        </>
    );
};

export default CartAndWishlist;
