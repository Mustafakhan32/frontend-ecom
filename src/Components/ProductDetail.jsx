import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Stars from 'react-stars';
import { useAuth } from '../store/Auth';
import reviewimg from '../assets/writereview.svg'
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import moment from 'moment'; // Import moment.js
import sizeChart from '../assets/size-chart.png'
import { Link } from 'react-router-dom';
import { useCart } from '@/store/CartContext';
import cartsvg from '../assets/cart1.svg'
import remcart from '../assets/remove-cart.svg'
import lg from '../assets/lg.svg'
import visitp from '../assets/visit.svg';
import wishlist1 from '../assets/wishlist1.svg';
import share from '../assets/share.svg'

const ProductDetail = () => {

  const localstring1 = `http://localhost:8000`
  const localstring2 = `http://ec2-13-233-91-181.ap-south-1.compute.amazonaws.com:80`

  const localstring = `https://backend-ecom-mfns.onrender.com`
  const [similarProducts, setSimilarProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newReview, setNewReview] = useState({ rating: null, comment: "" });
  const params = useParams();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Static limit of 5 reviews per page
  const [totalReviews, setTotalReviews] = useState(0); // To track total number of reviews
  const [auth] = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [fadeIn, setFadeIn] = useState(true); // State for fade animation
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false); // To track if more products exist
  const [limits, setLimits] = useState(4); // Start with 4 products
  // Touch event tracking
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Swipe threshold (minimum swipe distance to trigger image change)
  const swipeThreshold = 50;
  const [catId, setCatId] = useState('')
  const { cartItems, addToCart, removeFromCart, wishlistItems, addToWishlist, removeFromWishlist, updateCartItemSize, updateCartItemQuantity } = useCart(); // Destructure from context
  const isInCart = cartItems.some(item => item._id === product?._id); // Check if product is in the cart
  const isOptionsDisabled = !isInCart;


  //for product fetching
  useEffect(() => {
    if (params?.slug) {
      fetchProduct();
      window.scrollTo(0, 0); // Scroll to top when product changes

    }
  }, [params?.slug]);

  // useeffect for review
  useEffect(() => {
    if (product?._id) {
      fetchReviews(page);
    }
  }, [product?._id, page]);

  // Fetch similar products when both product and catId are available
  useEffect(() => {
    if (product?._id && catId) {
      fetchSimilarProducts(limits);
    }
  }, [product?._id, catId, limits]);
  const [localQuantity, setLocalQuantity] = useState(Number)

  const cartProduct = cartItems.find(item => item?._id === product?._id) || {}; // Use empty object as fallback


  const [selectedSize, setSelectedSize] = useState(cartProduct?.selectedSize || '');

  //getting products
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${localstring}/api/product/single-product/${params.slug}`);
      setProduct(data?.product);
      setMainImage(data?.product?.images?.[0]);
      setCatId(data?.product?.category?._id)

      // Check if the product is in the cart to set the local quantity
      const cartItem = cartItems.find(item => item.id === data?.product?.id); // Update the id property according to your product object
      setLocalQuantity(cartItem ? cartItem.quantity : 1); // Use quantity from cart or default to 1


      fetchSimilarProducts()
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  useEffect(() => {
    // Sync localQuantity and size with cart items on Cart update
    const cartItem = cartItems.find(item => item._id === product?._id);
    if (cartItem) {
      setLocalQuantity(cartItem.quantity);
      setSize(cartItem.selectedSize);
    }
  }, [cartItems, product?._id]);

  //getiing review
  const fetchReviews = async (page) => {
    try {
      const { data } = await axios.get(`${localstring}/api/review/${product._id}/get-reviews`, {
        params: { page, limit }, // Pass limit as well
      });
      setReviews(data.reviews);
      setTotalReviews(data.totalReviews); // Update total reviews count
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };
  //pagination for review next previous btn

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1); // Use a function to set the state
    }
  };

  const handleNextPage = () => {
    if ((page * limit) < totalReviews) {
      setPage(prevPage => prevPage + 1); // Use a function to set the state
    }
  };



  //submiting review
  const handleReviewSubmit = async () => {
    if (newReview.comment && newReview.rating) {
      try {
        const userId = auth.user?._id;
        const reviewData = {
          ...newReview,
          user: userId,
          productId: product._id,
        };

        await axios.post(`${localstring}/api/review/${product._id}/reviews`, reviewData);
        setNewReview({ rating: null, comment: "" }); // Clear the input after submission
        setPage(1); // Reset to the first page after submitting a review
        setShowReviewForm(false);
        fetchProduct()
        fetchReviews(1, limit); // Fetch reviews for the first page with the current limit

        toast.success('Review submitted successfully!'); // Success toast
      } catch (error) {
        console.error("Error posting review:", error.response ? error.response.data : error.message);
        toast.error('Please Login To Post Review Or Try Again later'); // Error toast
      }
    } else {
      toast.warn("Please provide both a rating and a comment."); // Warning toast
    }
  };

  //   // Fetch similar products based on current product's ID and category
  const fetchSimilarProducts = async (limits) => {
    try {
      const { data } = await axios.get(`${localstring}/api/product/similar-product/${product._id}/${catId}?limit=${limits}`);
      setSimilarProducts(data.products); // Set all products
      setShowLoadMore(data.hasMore); // Show Load More button if there are more products
    } catch (error) {
      const err = error
    }
  };
  const handleLoadMore = () => {
    setLimits((prevLimits) => prevLimits + 4); // Increase limits by 4 or your preferred increment
  };


  // Updated: handleImageClick with fade transition logic
  const handleImageClick = (index) => {
    setFadeIn(false); // Trigger fade out
    setTimeout(() => {
      setMainImage(product.images[index]);
      setCurrentIndex(index);
      setFadeIn(true); // Trigger fade in
    }, 300); // 100ms to trigger fade out before changing image
  };


  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  // Handle touch end and determine swipe direction
  const handleTouchEnd = () => {
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && currentIndex < product.images.length - 1) {
        // Swipe left, go to next image if not the last
        handleNextImage();
      } else if (swipeDistance < 0 && currentIndex > 0) {
        // Swipe right, go to previous image if not the first
        handlePrevImage();
      }
    }
  };

  // Updated: handleNextImage with fade transition logic
  const handleNextImage = () => {
    if (currentIndex < product.images.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setMainImage(product.images[currentIndex + 1]);
        setFadeIn(true);
      }, 300);
    }
  };

  // Updated: handlePrevImage with fade transition logic
  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setMainImage(product.images[currentIndex - 1]);
        setFadeIn(true);
      }, 300);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = localQuantity + 1;
    if (newQuantity <= 100) {
      setLocalQuantity(newQuantity);
      updateCartItemQuantity(product._id, newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      updateCartItemQuantity(product._id, newQuantity);
    }
  };
  useEffect(() => {
    // Reset localQuantity when product is removed from the cart
    const cartItem = cartItems.find(item => item._id === product?._id);
    if (!cartItem) {
      setLocalQuantity(1); // Reset to default value
      setSelectedSize(''); // Reset selected size
    }
  }, [cartItems, product?._id]); // Dependency on cartItems and product.id

  // Sync local selectedSize with cart context when it changes
  useEffect(() => {
    if (cartProduct?.selectedSize) {
      setSelectedSize(cartProduct.selectedSize);
    }
  }, [cartProduct?.selectedSize]);

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);
    updateCartItemSize(product._id, newSize);  // Update context
  };

  const handleQuantityChange = (e) => {
    const value = Math.min(Math.max(Number(e.target.value.replace(/[^0-9]/g, '')), 1), 100);
    setLocalQuantity(value);
    updateCartItemQuantity(product._id, value);
  };

  const totalPrice = product ? (product.price * localQuantity).toFixed(2) : 0; // Default to 0 if product is null

  if (!product) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          Loading...
        </div>
      </div>
    );
  }


  return (
    <div className="p-2 md:p-4 mt-4 mb-1 space-y-0 container mx-auto">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row items-start bg-gray-100 shadow-xl rounded-xl gap-5">
        {/* Left: Image and Carousel */}
        <div className="w-full lg:w-1/2  mx-auto   pb-5 overflow-hidden">
          <div className="relative p-2  mx-auto on-small-single-img ">
            {/* Main Image with Animation */}
            <img
              src={mainImage}
              alt="Main Product"
              className={`w-full max-h-[70vh]  md:max-h-[60vh] img-size lg:max-h-[70vh] object-cover  rounded-xl shadow-lg transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setFadeIn(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          {/* Thumbnail Images with Navigation */}
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center">
              <button
                className={`text-black p-2 rounded-full shadow-md transition duration-300 ease-in-out ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:text-white hover:bg-black"}`}
                onClick={handlePrevImage}
                disabled={currentIndex === 0 || product.images.length === 1}
              >
                &#10094;
              </button>

              <div className="flex overflow-x-auto space-x-2 mx-2 rounded-lg max-w-full snap-x snap-mandatory">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className={`cursor-pointer w-12 h-16 md:w-16 md:h-20 object-cover rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-95 ${index === currentIndex ? "ring-2 ring-white" : ""}`}
                    onClick={() => product.images.length > 1 && handleImageClick(index)}
                  />
                ))}
              </div>

              <button
                className={`text-black p-2 rounded-full shadow-md transition duration-300 ease-in-out ${currentIndex === product.images.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:text-white hover:bg-black"}`}
                onClick={handleNextImage}
                disabled={currentIndex === product.images.length - 1 || product.images.length === 1}
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>



        {/* Right: Product Details */}
        <div className="w-full  mt-1 md:w-2/2 space-y-1 ">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl ml-4 font-bold text-gray-800">
              {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
            </h1>
            <Link
              to={`/category/${product?.category?.slug}`}
              key={product?.category?._id}
              title='Categories'
              className="hover:underline text-black"
            >
              <p className="text-gray-800 ml-4 font-semibold hover:underline">
                {product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}
              </p>
            </Link>
          </div>

          <div className="flex ml-4  items-center space-x-2 ">
            <Stars
              value={parseFloat(product.averageRating)} // Use the calculated average rating from backend
              size={24}
              half={false}
              color2={"#ffd700"} // Color for filled stars
              className='text-sm'
              edit={false} // Make it non-editable for average display
            />
            <span className="text-gray-700 ">
              ({product.totalReviews} Reviews)
            </span>
          </div>
          {/* Discount and Price Section */}
          <div className="flex items-center ml-4 space-x-2 ">
            {cartItems.find(item => item.id === product.id) ? (
              <p className="text-gray-500 text-xl font-bold">Rs. {totalPrice}</p> // Display total price if in cart
            ) : (
              <p className="text-gray-500 text-xl font-bold">Rs. {(product.price).toFixed(2)}</p> // Display normal price
            )}


            <p className="line-through  text-red-500 font-semibold text-sm">Rs. {product.discountPrice.toFixed(2)}</p>
          </div>

          <div>
            <div className="flex ml-4 items-center space-x-2 mt-2 ">

              {/* Add to Cart Button */}
              {isInCart ? (
                <button
                  onClick={() => removeFromCart(product._id)} // Remove product from cart
                  className="bg-red-500  text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  title="Remove From Cart"
                >
                  <img width={25} height={25} src={remcart} alt="Remove From Cart" />
                </button>
              ) : (
                <button
                  onClick={() => addToCart({ ...product, quantity: 1, size: "", color: "", fabric: "" })} // Add default product attributes
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition duration-300 ease-in-out"
                  title="Add To Cart"
                >
                  <img width={25} height={25} src={cartsvg} alt="Add To Cart" />
                </button>
              )}

              {/* /* Toggle Size Chart Button */}
              <button
                className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out text-white ${showSizeChart ? "bg-red-500 hover:bg-red-600" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                onClick={() => setShowSizeChart(!showSizeChart)}
                title="Size Chart Image"
              >
                <img width={25} height={25} src={lg} alt="Size Chart Image" />
              </button>

              {/* /* Toggle Review Form Button */}
              <button
                className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out text-white ${showReviewForm ? "bg-red-500 hover:bg-red-600" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                onClick={() => setShowReviewForm(!showReviewForm)}
                title="Write A Review"
              >
                <img width={26} height={26} src={reviewimg} alt="Write A Review" />
              </button>

              {/* Size Chart Button */}
            </div>

            {/* Size and Quantity Selection */}
            <div className="flex mt-4 ml-4">
              <div className="flex-1 max-w-[99px] mr-1">
                <h3 className="block text-lg font-semibold font-sans text-gray-700">Quantity</h3>
                <div className="flex items-center border border-gray-400 rounded h-10 mt-1">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-2 bg-black cursor-pointer text-white rounded-l hover:bg-slate-800 hover:text-white transition-all"
                    disabled={isOptionsDisabled}
                  >
                    &#8722;
                  </button>

                  <input
                    type="text"
                    className={`w-12 text-center border-0 outline-none transition duration-300 h-10 ${isOptionsDisabled ? 'bg-gray-200 text-gray-500' : 'bg-white text-black' // Highlighted when active
                      }`}
                    value={localQuantity}
                    onChange={handleQuantityChange}
                    disabled={isOptionsDisabled}
                    readOnly={!isOptionsDisabled} // Makes input read-only when active
                  />

                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-2 bg-black cursor-pointer text-white hover:bg-slate-800 hover:text-white transition-all rounded-r"
                    disabled={isOptionsDisabled}
                  >
                    &#43;
                  </button>
                </div>



              </div>
              <div className="flex-1 max-w-[96px] ml-2">
                <h3 className="block text-lg font-semibold font-sans text-gray-700 ml-1">Size </h3>
                {/* Size Dropdown */}
                <select
                  disabled={isOptionsDisabled}
                  value={selectedSize}  // Use the updated local state for immediate feedback
                  onChange={handleSizeChange}

                  className={`border cursor-pointer border-gray-300 rounded-lg p-2 w-30 mt-1 ml-1 transition duration-300 ease-in-out ${isOptionsDisabled ? 'bg-gray-200 text-gray-500' : 'bg-white text-black' // Highlighted when active
                    }`}
                >
                  <option value='' disabled>Sizes</option>
                  {Object.keys(product.sizes).map((size) => (
                    product.sizes[size] && (  // Only show available sizes
                      <option key={size} value={size}>
                        {size}
                      </option>
                    )
                  ))}
                </select>

              </div>
            </div>

            {/* Buttons Container */}

            <p className="text-gray-800 text-xl mt-4 ml-4 w-[765px] small-description">{product.description.charAt(0).toUpperCase() + product.description.slice(1)}</p>

            {/* Show Size Chart */}
            <div className={`size-chart ${showSizeChart ? 'show' : ''} mt-10 ml-4`}>
              <img src={sizeChart} alt="Size Chart" className="w-72 rounded-lg shadow-lg max-w-xl " />
            </div>
            {/* Review Submission Form */}
            <div
              className={`overflow-hidden ml-4 w-[765px] width-problem transition-all  duration-500 ease-in-out ${showReviewForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className={`mt-2  transition-opacity  duration-500 ${showReviewForm ? 'opacity-100' : 'opacity-0'}`}>
                {/* Rating Section */}
                <div className="flex items-center   space-x-2">
                  <p className='block text-lg mt-1 font-semibold font-sans  text-gray-700'>Give Review</p>
                  <Stars
                    count={5}
                    value={newReview.rating}
                    onChange={(newRating) => setNewReview({ ...newReview, rating: newRating })}
                    size={24}
                    half={false}
                    color2={"#ffd700"}
                  />
                </div>

                {/* Review Submission Section */}
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Leave a review..."
                  className="w-full border  review-small-cmnt font-sans border-gray-300 rounded-lg p-3 h-28 resize-none transition duration-300 ease-in-out mt-3"
                />
                <div>
                  <button
                    className="mt-2  mb-2 bg-black active:text-white active:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out"
                    onClick={handleReviewSubmit}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Reviews Section */}
          {reviews.length > 0 ? (
            <div className="mt-0">
              <h2 className="text-3xl text-gray-800 ml-4 mb-4 mt-4 font-sans">Reviews</h2>

              {/* Review List */}
              <div className="grid grid-cols-1 ml-4 sm:grid-cols-3 lg:grid-cols-4 md:grid-cols-3 gap-4 mb-5 mr-5">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border cursor-pointer review-section-small bg-white border-gray-300 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 duration-300"
                  >
                    <h4 className="font-semibold text-sm">
                      {review.user && review.user.name
                        ? review.user.name.charAt(0).toUpperCase() + review.user.name.slice(1)
                        : "Deleted User"}

                    </h4>
                    {/* Display formatted timestamp */}
                    <p className="text-gray-500 text-xs">
                      {moment(review.createdAt).format('MMM Do YY, h:mm A')}
                    </p>
                    <Stars
                      count={5}
                      value={review.rating}
                      size={20}
                      className="text-sm"
                      edit={false}
                      color2={"#ffd700"}
                    />
                    {/* Updated Comment Paragraph */}
                    <p className="text-gray-600 text-sm mt-1 break-words">{review.comment.charAt(0).toUpperCase() + review.comment.slice(1)}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalReviews > 5 && (
                <div className="mt-6 flex justify-between mb-6 container">
                  <button
                    className={`text-black p-2 rounded-full ml-[18px] shadow-md hover:text-white hover:bg-black px-4 transition duration-300 ease-in-out ${page === 1 && 'opacity-50 cursor-not-allowed'}`}
                    disabled={page === 1}
                    onClick={handlePrevPage}
                  >
                    &#10094;
                  </button>
                  <button
                    className={`text-black p-2 rounded-full  shadow-md mr-[18px] hover:text-white hover:bg-black px-4 transition duration-300 ease-in-out ${(page * limit) >= totalReviews && 'opacity-50 cursor-not-allowed'}`}
                    disabled={(page * limit) >= totalReviews}
                    onClick={handleNextPage}
                  >
                    &#10095;
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div >
            </div>
          )}

        </div>
      </div >
      {/* Similar Products Section */}
      < div className="mt-10" >
        <h2 className="text-3xl font-sans  text-center mb-8 mt-8">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {similarProducts.map((item) => {
            const isInCart = cartItems.some(cartItem => cartItem._id === item._id);
            const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem._id === item._id);

            // Function to copy product link to clipboard
            const handleShare = async () => {
              const productLink = `${window.location.origin}/single-product/${item.slug}`;

              if (navigator.share) {
                try {
                  await navigator.share({
                    url: productLink,// The product link
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
              <div key={item._id} className="w-full mb-4 max-w-[380px] mx-auto sm:max-w-none rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="relative">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-96 object-cover hover:shadow-xl transition-shadow duration-500 ease-in-out"
                  />
                  <div className="absolute bottom-0 left-0 p-4 flex flex-col items-start space-y-2">
                    <Link className="w-9" to={`/single-product/${item.slug}`}>
                      <img
                        title="View Item"
                        src={visitp}
                        className="w-9 text-black p-0.5 rounded-full shadow-lg hover:text-white hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out"
                      />
                    </Link>
                    <img
                      onClick={() => {
                        if (isInWishlist) {
                          removeFromWishlist(item._id); // Remove from wishlist
                        } else {
                          addToWishlist(item); // Add to wishlist
                        }
                      }}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      src={wishlist1}
                      className={`w-8 text-black p-0.5 rounded-full shadow-md hover:text-white hover:bg-black transition-colors cursor-pointer duration-300 ease-in-out ${isInWishlist ? "bg-red-500 " : "hover:bg-black"}`} // Change background color if in wishlist
                    />
                    <img
                      onClick={() => handleShare(item)}
                      title="Share Product Link"
                      src={share} // Change this SVG later
                      className="w-8 text-black p-0.5 rounded-full shadow-md hover:text-white hover:bg-black  active:text-white active:bg-black  transition-colors cursor-pointer duration-300 ease-in-out"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-100" title="Product Card">
                  <div className="w-32">
                    <Link to={`/single-product/${item.slug}`}>
                      <h3 className="text-lg font-semibold hover:underline text-gray-800">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h3>
                    </Link>
                  </div>
                  <div className="w-32">
                    <Link
                      to={`/category/${item?.category?.slug}`}
                      key={item?.category?._id}
                      title='Categories'
                      className="hover:underline text-black ">
                      <p className="mt-0 text-gray-500 hover:underline">{item.category.name.charAt(0).toUpperCase() + item.category.name.slice(1)}</p>

                    </Link>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Stars
                      count={5}
                      value={parseFloat(item.averageRating)}
                      edit={false}
                      color2={'#ffd700'}
                      className="text-yellow-500"
                    />
                    <span className="ml-2 text-gray-600">({item.totalReviews} reviews)</span>
                  </div>

                  {/* Discount and Price Section */}
                  <div className="flex items-center space-x-2">
                    <p className=" font-bold text-lg  text-gray-500">Rs. {item.price.toFixed(2)}</p>
                    <p className="line-through font-semibold text-red-500">Rs. {item.discountPrice.toFixed(2)}</p>
                  </div>
                  {/* Conditional Button Rendering */}
                  {isInCart ? (
                    <button
                      onClick={() => removeFromCart(item._id)} // Use item._id for removal
                      className="mt-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item)} // Use addToCart when the item is not in the cart
                      className="mt-1 bg-black active:text-white active:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>

            );
          })}
          {/* Show Load More button if there are more products */}
        </div>
        {
          showLoadMore && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="mt-1 bg-black active:text-white active:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out"
              >
                Load More
              </button>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default ProductDetail;
