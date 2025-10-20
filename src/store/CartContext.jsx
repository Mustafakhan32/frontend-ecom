import React, { createContext, useContext, useState } from 'react';

// Create a context
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    const addToCart = (product) => {
        const itemWithSize = {
            ...product,
            quantity: 1,
            size: '',
            total: product.price * 1 // Set initial total
        };

        setCartItems((prev) => {
            const existingItem = prev.find(item => item._id === itemWithSize._id);
            if (existingItem) {
                const updatedCart = prev.map(item =>
                    item._id === itemWithSize._id
                        ? { ...existingItem, quantity: existingItem.quantity + 1, total: item.price * (existingItem.quantity + 1) } // Update total on quantity change
                        : item
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                return updatedCart;
            }
            const updatedCart = [...prev, itemWithSize];
            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };


    const addToWishlist = (product) => {
        setWishlistItems((prev) => {
            const updatedWishlist = [...prev, product];
            localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist)); // Save to localStorage
            return updatedWishlist;
        });
    };
    // Add inside CartProvider
    const moveWishlistToCart = () => {
        wishlistItems.forEach((item) => {
            addToCart(item);
            removeFromWishlist(item._id);
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => {
            const updatedCart = prev.filter(item => item._id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Save to localStorage
            return updatedCart;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prev) => {
            const updatedWishlist = prev.filter(item => item._id !== productId);
            localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist)); // Save to localStorage
            return updatedWishlist;
        });
    };
    const updateCartItemQuantity = (productId, quantity) => {
        setCartItems((prev) => {
            const updatedCart = prev.map(item =>
                item._id === productId
                    ? { ...item, quantity: Number(quantity), total: item.price * Number(quantity) } // Ensure total is updated
                    : item
            );
            localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Save updated cart with totals to localStorage
            return updatedCart;
        });
    };

    const updateCartItemSize = (id, size) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item._id === id ? { ...item, selectedSize: size } : item
            );

            // Update local storage with updated items
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return updatedItems; // Return updated items to set the state
        });
    };
    const updateCartItemFabric = (id, fabric) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item._id === id ? { ...item, selectedFabric: fabric } : item
            );

            // Update local storage with updated items
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return updatedItems; // Return updated items to set the state
        });
    };

    const updateCartItemColor = (id, color) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item._id === id ? { ...item, color: color } : item
            );

            // Update local storage with updated items
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return updatedItems; // Return updated items to set the state
        });
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            wishlistItems,
            addToCart,
            addToWishlist,
            removeFromCart,
            removeFromWishlist,
            updateCartItemSize,
            updateCartItemFabric,
            updateCartItemQuantity,
            updateCartItemColor,
            setCartItems,
            setWishlistItems,
            moveWishlistToCart

        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for using the CartContext
export const useCart = () => {
    return useContext(CartContext);
};
