import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Pie from '../assets/pie.svg';
import { useAuth } from "../store/Auth";
import logo from '../assets/logo.jpg';
import axios from 'axios'
import wish from '../assets/wishlist.svg'
import cart from '../assets/cart.svg'
import profile from '../assets/profile.svg'
import { useCart } from "../store/CartContext";
import sea from '../assets/search.svg'
import sea1 from '../assets/search1.svg'

export default function Header({ setCartOpen, setWishOpen }) {
    const [MenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [auth, setAuth] = useAuth();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const locastring1 = `http://localhost:8000`
    const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`
    const localstring = `https://backend-ecom-mfns.onrender.com`
    const { cartItems, wishlistItems, setCartItems, setWishlistItems } = useCart();
    const resultsRef = useRef(null); // Define the ref for search results

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        });

        setCartItems([]); // Clear cart items on logout
        setWishlistItems([]); // Clear wishlist items on logout
        localStorage.removeItem('cartItems');
        localStorage.removeItem('wishlistItems');
        localStorage.removeItem('auth');
        navigate('/');
    };



    const handleToggleSearch = () => {
        if (isOpen && !searchKeyword.trim()) {
            setIsOpen(false); // Close if open and no text
        } else {
            setIsOpen(true); // Open otherwise
            if (inputRef.current) inputRef.current.focus();
        }
    };

    const handleSearchInput = async (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        if (keyword.trim()) {
            try {
                const { data } = await axios.get(`${localstring}/api/product/search/${keyword}`, {
                    params: { page: 1, limit: 5 }
                });
                setSearchResults(data.data || []);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                if (searchKeyword.trim() === '') setIsOpen(false); // Close if empty
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchKeyword]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) navigate(`/search/${searchKeyword}`);
        setSearchResults([]);
        setIsOpen(false);
    };
    // Effect to handle clicks outside of search results
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
                setIsOpen(false); // Close if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // style={{backgroundColor:'d3c2b0'}}
    return (
        <header style={{ backgroundColor: '#0b0b15' }} className=' text-white z-20 sticky on-mob top-0'>
            <div className='mx-auto sticky container header-only py-4 flex justify-between items-center'>
                {/* Logo Section */}
                <Link to={'/'} title='HomePage'>
                    <img title='Logo' src={Pie} className='w-10 rounded-full hover:scale-105 transition-all' />
                </Link>

                {/* For larger screens: Navigation Links */}
                <ul className='hidden nav-bars lg-block md:block ml-72 xl:flex items-center gap-7 font-semibold text-base'>
                    {/* <Link to={'/product'} title='product' className='p-3 ml-14 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer'>Product</Link> */}
                    <Link to={'/about'} title='about' className='p-3 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer'>About</Link>

                    {/* Show login/signup only if not signed in */}
                    {!auth.user && (
                        <>
                            <Link to={'/login'} title='login' className='p-3 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer'>Login</Link>
                            <Link to={'/signup'} title='signup' className='p-3 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer'>Signup</Link>
                        </>
                    )}

                    {/* Show profile icon if signed in */}
                    {auth.user && (
                        <div className="relative inline-block"> {/* Changed to inline-block for better alignment */}
                            <li
                                alt="profile"
                                title='profile'
                                className="p-3 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer"
                                onClick={() => setProfileMenuOpen(prev => !prev)} // Toggle profile menu
                            >{auth?.user?.name}</li>
                            {profileMenuOpen && (
                                <ul style={{ backgroundColor: '#0b0b15' }} className="absolute -mr-4 rounded-md  w-40 border border-slate-600 shadow-lg z-50">
                                    <li className="px-4 py-2 font-sans hover:bg-gray-400 cursor-pointer rounded-md  transition-colors " onClick={() => navigate('/user')}>
                                        Profile
                                    </li>
                                    <li className="px-4 py-2 font-sans  hover:bg-gray-400 cursor-pointer rounded-md  transition-colors" onClick={handleLogout}>
                                        Sign Out
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                </ul>


                {/* Search Box */}
                <div className='hidden md:flex items-center gap-4'>
                    <div className='relative hidden md:flex items-center gap-4'>
                        <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchKeyword}
                                onChange={handleSearchInput}
                                ref={inputRef}
                                className={`py-1 pl-1  shadow-md transition duration-300 ease-in-out text-black focus:outline-none focus:ring-2 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                                style={{ transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out' }}
                            />
                            <img
                                src={sea}
                                className='ml-2 w-9 cursor-pointer rounded-full hover:bg-gray-400 transition-colors p-2'
                                title='Search'
                                alt="search"
                                onClick={handleToggleSearch}
                            />
                        </form>
                        {/*               <p className="mt-0 text-gray-800 font-semibold hover:underline">{product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}</p>  */}
                        {isOpen && searchResults.length > 0 && (
                            <ul
                                ref={resultsRef} // Add ref here for outside click detection
                                className="absolute top-full search-bar-long bg-white text-black shadow-lg border border-gray-200"
                            >
                                {searchResults.map((product, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setSearchKeyword(product.name);
                                            setIsOpen(false);
                                            navigate(`/single-product/${product.slug}`);
                                        }}
                                        className="p-2 flex items-center hover:bg-gray-200 cursor-pointer transition-all duration-150 ease-in-out"
                                    >
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-16 h-24 rounded-lg hover:shadow-xl transition-shadow duration-500 ease-in-out"
                                        />
                                        <div className="ml-2 flex flex-col">
                                            <span className="text-md font-semibold">
                                                {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                                            </span>
                                            <span className='text-md font-semibold'>
                                                {product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}
                                            </span>
                                            <span className="text-md font-medium text-gray-600">Rs. {product.price}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}




                    </div>

                    <button
                        onClick={() => setCartOpen(prev => !prev)}
                        className='relative ml-2 p-2 flex items-center gap-2'>
                        <img title='Cart ' src={cart} className='w-9 rounded-full hover:bg-gray-400 p-2 hover:scale-105 transition-all' />
                        {cartItems.length > 0 && ( // Show count if there are items
                            <span className='absolute top-2 right-2 bg-red-500 text-white rounded-full px-1 text-xs'>{cartItems.length}</span>
                        )}
                    </button>

                    <button
                        onClick={() => setWishOpen(prev => !prev)}
                        className='relative p-2 flex items-center gap-2'>
                        <img title='wishlist' src={wish} className='w-9 rounded-full hover:bg-gray-400 p-2 hover:scale-105 transition-all' />
                        {wishlistItems.length > 0 && ( // Show count if there are items
                            <span className='absolute top-2 right-2 bg-red-500 text-white rounded-full px-1 text-xs'>{wishlistItems.length}</span>
                        )}
                    </button>


                </div>

                {/* Hamburger Menu and Cart SVG for Small Screens */}
                <div className='md:hidden flex items-center gap-3'>
                    <button onClick={() => setCartOpen(prev => !prev)} className='relative p-2 flex items-center gap-2'>
                        <img title='Cart' src={cart} className='w-6 rounded-full hover:scale-105 transition-all' />
                        {cartItems.length > 0 && ( // Show count if there are items
                            <span className='absolute top-0.5  right-1 bg-red-500 text-white rounded-full px-1 text-xs'>{cartItems.length}</span>
                        )}
                    </button>
                    <button onClick={() => setWishOpen(prev => !prev)} className='relative p-2 flex items-center gap-2'>
                        <img title='Wishlist' src={wish} className='w-6 rounded-full hover:scale-105 transition-all' />
                        {wishlistItems.length > 0 && ( // Show count if there are items
                            <span className='absolute top-0.5 right-1 bg-red-500 text-white rounded-full px-1 text-xs'>{wishlistItems.length}</span>
                        )}
                    </button>
                    <i
                        className='bx bx-menu block mr-1 cursor-pointer'
                        style={{ fontSize: '2rem' }}
                        onClick={() => setMenuOpen(!MenuOpen)}
                    ></i>
                </div>
            </div>
            {/* Mobile Menu */}

            <div
                className={`absolute xl:hidden top-18 left-0 w-full bg-slate-900 flex flex-col items-center gap-2 font-semibold text-lg transform transition-transform z-30  
    ${MenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
                style={{ backgroundColor: '#0b0b15', transition: 'transform 0.3s ease, opacity 0.3s ease' }}
            >
                {/* Search Bar Visible in Hamburger Menu */}
                <form onSubmit={handleSearchSubmit} className="w-full"> {/* Added w-full to the form */}
                    <div className='relative z-30 flex items-center justify-between w-full p-4'> {/* Ensure full width */}
                        <input
                            type='text'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)} // Update keyword state
                            placeholder='Search...'
                            className='py-2 pl-6 pr-14 rounded-xl border-2 border-slate-600 focus:bg-slate-100 text-black transtion-colors w-full' // w-full ensures it takes full width
                            style={{ textOverflow: 'ellipsis' }} // Ensure the text is truncated
                        />
                        <img width={30} height={30} src={sea1}
                            onClick={handleSearchSubmit} // Trigger search on icon click
                            className='absolute z-50 right-6  top-6 cursor-pointer  text-2xl text-black' />
                    </div>
                </form>

                <Link to={'/product'} title='product' className='list-none w-full text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>Product</Link>
                <Link to={'/about'} title='about' className='list-none w-full text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>About</Link>

                {/* Conditionally render login/signup or profile options based on auth state */}
                {!auth.user && (
                    <>
                        <Link to={'/login'} className='list-none w-full text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>Login</Link>
                        <Link to={'/signup'} className='list-none w-full text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>Signup</Link>
                    </>
                )}
                {auth.user && (
                    <>
                        <Link to={'/user'} className='list-none w-full  text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>{auth?.user?.name}</Link>
                        <button onClick={handleLogout} className='w-full text-center p-4 hover:bg-gray-400 hover:text-white transition-all cursor-pointer'>Sign Out</button>
                    </>
                )}
            </div>

        </header>
    );
}