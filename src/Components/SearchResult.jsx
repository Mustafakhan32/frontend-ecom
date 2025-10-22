import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Pie from '../assets/pie.svg'; // Importing the icon for wishlist/view item
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext'; // Import the useCart hook
import wishlist from '../assets/wishlist1.svg';
import visitp from '../assets/visit.svg';
import share from '../assets/share.svg'
import Stars from 'react-stars'; // Import react-stars
import CartAndWishlist from './CartAndWishlist';
const SearchResults = () => {
    const { keyword } = useParams(); // Get the search keyword from the URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishOpen, setWishOpen] = useState(false);
    const localstring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`

    const localstring = `https://backend-ecom-mfns.onrender.com`
    const { cartItems, addToCart, wishlistItems, addToWishlist, removeFromCart, removeFromWishlist } = useCart(); // Include updateCartItemQuantity from context

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${localstring}/api/product/search/${keyword}`);
                setProducts(response.data.data); // Ensure you're setting the data array
                setLoading(false);
            } catch (err) {
                setError('Error fetching products. Please try again.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);
    useEffect(() => {
        if (cartOpen || wishOpen) {
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        } else {
            document.body.style.overflow = 'auto'; // Allow body scroll
        }
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [cartOpen, wishOpen]);


    if (loading) {
        return (
            <>
                <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />

                <div className='flex justify-center items-center h-screen'>
                    <div className='text-center font-sans font-semibold'>
                        Loading Search Result Please Wait...
                    </div>
                </div>
                <Footer />

            </>
        );
    }

    return (
        <>
            <Header setCartOpen={setCartOpen} setWishOpen={setWishOpen} />
            <div className="min-h-screen p-6 ">
                <h1 className="text-3xl text-center font-sans mb-6">Search Results For: "{keyword}"</h1>
                <div className=" grid grid-cols-1 mx-auto container sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
                    {products.map((product) => {
                        const isInCart = cartItems.some(item => item._id === product._id);
                        const isInWishlist = wishlistItems.some(item => item._id === product._id);

                        return (
                            <div key={product._id} className="w-full max-w-[380px] mx-auto sm:max-w-none rounded-lg overflow-hidden shadow-lg bg-white">
                                <div className="relative">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-96 object-cover hover:shadow-xl transition-shadow duration-500 ease-in-out"

                                    />
                                    <div className="absolute bottom-0 left-0 p-4 flex flex-col items-start space-y-2">
                                        <Link className="w-9" to={`/single-product/${product.slug}`}>
                                            <img
                                                title="View Item"
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
                                            className={`w-8 text-black p-0.5 rounded-full shadow-lg hover:text-white active:text-white active:bg-black hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out ${isInWishlist ? "bg-red-500 " : "hover:bg-black"}`} // Change background color if in wishlist
                                        />
                                        <img
                                            onClick={() => handleShare(product)}
                                            title="Share Product Link"
                                            src={share} // Change this SVG later
                                            className="w-8 text-black p-0.5 rounded-full shadow-lg hover:text-white active:text-white active:bg-black hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out"
                                        />
                                    </div>


                                </div>

                                <div className="p-4 bg-gray-100" title="Product-Card">
                                    <div className="w-32">
                                        <Link to={`/single-product/${product.slug}`}>
                                            <h3 className="text-lg font-bold hover:underline text-black">
                                                {product.name}
                                            </h3>
                                        </Link>
                                    </div>
                                    <div className="w-32">
                                        <Link
                                            to={`/category/${product?.category?.slug}`}
                                            key={product?.category?._id}
                                            title='Categories'
                                            className="hover:underline text-black ">

                                            <p className="mt-0 text-gray-500 hover:underline">{product.category.name}</p>
                                        </Link>
                                    </div>
                                    <div className="flex items-center">
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
                                        <p className=" font-bold text-lg  text-gray-500">Rs. {(product.price * 0.8).toFixed(2)}</p>
                                        <p className="line-through font-semibold text-red-500">Rs. {product.price.toFixed(2)}</p>
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
            </div >
            <Footer />
            <CartAndWishlist cartOpen={cartOpen} setCartOpen={setCartOpen} wishOpen={wishOpen} setWishOpen={setWishOpen} />


        </>
    );
};

export default SearchResults;
