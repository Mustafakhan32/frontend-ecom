import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pie from '../assets/pie.svg';
import Stars from 'react-stars'; // Import react-stars
import { useCart } from '../store/CartContext'; // Import the useCart hook to access cart functions
import wishlist from '../assets/wishlist1.svg';
import visitp from '../assets/visit.svg';
import share from '../assets/share.svg'
const Card = () => {
    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    const localstring = `https://backend-seprate.onrender.com`
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Track current page
    const [hasMore, setHasMore] = useState(true); // Track if there are more products
    const limit = 12; // Set the number of products per page
    const { cartItems, addToCart, removeFromCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart(); // Destructure from context
    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${localstring}/api/product/get-product?page=${page}&limit=${limit}`);
            if (response.data.success) {
                setProducts(prevProducts => [...prevProducts, ...response.data.products]); // Append new products
                setHasMore(response.data.products.length === limit); // If the returned products are less than the limit, no more products available
            } else {
                setError('Failed to fetch products.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]); // Fetch products whenever the page changes

    const loadMore = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1); // Increment page number to fetch more products
        }
    };

    const handleShare = async (product) => {
        const productLink = `${window.location.origin}/single-product/${product.slug}`;

        if (navigator.share) {
            try {
                await navigator.share({

                    url: productLink,              // The product link
                });
                console.log('Product shared successfully!');
            } catch (error) {
                console.error('Error sharing product:', error);
            }
        } else {
            // Fallback: copy to clipboard if `navigator.share` is not supported
            navigator.clipboard.writeText(productLink)
                .then(() => {
                    alert('Product link copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy link: ', err);
                });
        }
    };

    return (
        <div className="p-0 mb-4 mt-8 container mx-auto ">

            <h1 className="text-3xl font-sans  text-center mb-3 ">PRODUCTS</h1>
            {loading && <p className="text-center h-screen font-semibold text-xl">Loading Products...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Grid system with better mobile optimization */}
            <div className="grid grid-cols-1 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" >
                {products.map((product) => {
                    const isInCart = cartItems.some(item => item._id === product._id);
                    const isInWishlist = wishlistItems.some(item => item._id === product._id);

                    return (
                        <div key={product._id} className="w-full max-w-[380px]  mx-auto sm:max-w-none rounded-lg overflow-hidden shadow-lg bg-white">
                            <div className="relative ">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-96 object-cover hover:shadow-xl transition-shadow duration-500 ease-in-out "

                                />
                                <div className="absolute bottom-0 left-0 p-4 flex flex-col items-start space-y-2">
                                    <Link className="w-9" to={`/single-product/${product.slug}`}>
                                        <img
                                            title="View Product"
                                            src={visitp}
                                            className="w-9 text-black p-0.5 rounded-full shadow-lg hover:text-white active:text-white active:bg-black hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out"
                                        />
                                    </Link>
                                    <img
                                        onClick={() => {
                                            if (isInWishlist) {
                                                removeFromWishlist(product._id); // Remove from wishlist
                                            } else {
                                                addToWishlist(product); // Add to wishlist
                                            }
                                        }}
                                        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                        src={wishlist}
                                        className={`w-8 text-black p-0.5 rounded-full shadow-md hover:text-white active:text-white active:bg-black hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out ${isInWishlist ? "bg-red-500" : "hover:bg-black"}`} // Change background color if in wishlist
                                    />
                                    <img
                                        onClick={() => handleShare(product)}
                                        title="Share Product Link"
                                        src={share} // Change this SVG later
                                        className="w-8 text-black p-0.5 rounded-full shadow-md hover:text-white active:text-white active:bg-black hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out"
                                    />
                                </div>


                            </div>

                            <div className="p-4 py-2 bg-gray-100" title="Product-Card">
                                <div className="w-32">
                                    <Link to={`/single-product/${product.slug}`}>
                                        <h3 className="text-lg font-bold hover:underline text-black">
                                            {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                                        </h3>
                                    </Link>
                                </div>
                                <div className="w-32">
                                    <Link
                                        to={`/category/${product?.category?.slug}`}
                                        key={product?.category?._id}
                                        title='Categories'
                                        className="hover:underline text-black ">

                                        <p className="mt-0 text-gray-500 hover:underline">{product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}</p>
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Stars
                                        count={5}
                                        value={parseFloat(product.averageRating)}
                                        edit={false}
                                        color2={'#ffd700'}
                                        className="text-yellow-500"
                                    />
                                    <span className="ml-2 text-gray-600">({product.totalReviews} reviews)</span>
                                </div>
                                {/* Discount and Price Section */}
                                <div className="flex items-center space-x-2">
                                    <p className=" font-bold text-lg  text-gray-500">Rs. {product.price.toFixed(2)}</p>
                                    <p className="line-through font-semibold text-red-500">Rs. {product.discountPrice.toFixed(2)}</p>
                                </div>
                                {/* Conditional Button Rendering */}
                                {isInCart ? (
                                    <button
                                        onClick={() => removeFromCart(product._id)} // Use product._id for removal
                                        className="mt-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                    >
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product)} // Use addToCart when the item is not in the cart
                                        className="mt-1 bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {
                hasMore && (
                    <div className="text-center mt-4">
                        <button onClick={loadMore}
                            className="mt-3 bg-black active:text-white active:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out">
                            Load More

                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default Card;
