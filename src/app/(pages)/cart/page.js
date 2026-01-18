// app/cart/page.jsx
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  removeFromCart, 
  increaseQty, 
  decreaseQty, 
  clearCart 
} from "@/store/cartSlice";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaWhatsapp, FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaTimes } from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // Customer form state
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    paymentMethod: "cod",
    additionalNotes: ""
  });

  // Form validation
  const [errors, setErrors] = useState({});
  
  // Your WhatsApp number
  const whatsappNumber = "8801906884840";

  // ✅ MOVE FORMAT PRICE FUNCTION TO TOP
  const formatPrice = (price) => {
    return new Intl.NumberFormat("bn-BD").format(price);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  // Calculate total items count
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Bangladeshi districts for dropdown
  const districts = [
    "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", 
    "রংপুর", "ময়মনসিংহ", "গাজীপুর", "নারায়ণগঞ্জ", "কুমিল্লা", "নোয়াখালী",
    "বগুড়া", "ঝিনাইদহ", "পাবনা", "সাতক্ষীরা", "ফেনী", "লক্ষ্মীপুর"
  ];

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!customerDetails.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(?:\+88|88)?01[3-9]\d{8}$/.test(customerDetails.phone)) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number";
    }
    
    if (!customerDetails.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!customerDetails.district) {
      newErrors.district = "Please select a district";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Generate WhatsApp message with customer details
  const generateWhatsAppMessage = () => {
    let message = `📚 *Book Order Request* 📚\n\n`;
    
    // Customer Information
    message += `*📋 Customer Information:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 Name: ${customerDetails.name}\n`;
    message += `📞 Phone: ${customerDetails.phone}\n`;
    message += `📍 District: ${customerDetails.district}\n`;
    message += `🏠 Address: ${customerDetails.address}\n`;
    message += `💳 Payment: ${customerDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bkash/Nagad'}\n\n`;
    
    // Order Summary
    message += `*🛒 Order Summary:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   ✍️ Author: ${item.author || "Unknown"}\n`;
      // ✅ Now formatPrice is accessible here
      message += `   💰 Price: ৳${formatPrice(item.price)} x ${item.quantity} = ৳${formatPrice(item.price * item.quantity)}\n`;
      if (index < cartItems.length - 1) message += `   ────────────────\n`;
    });
    
    // Order Total
    message += `\n*💰 Order Total:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📚 Total Items: ${totalItems}\n`;
    // ✅ Now formatPrice is accessible here
    message += `💵 Subtotal: ৳${formatPrice(totalPrice)}\n`;
    message += `🚚 Shipping: ${totalPrice >= 500 ? 'FREE' : '৳50'}\n`;
    // ✅ Now formatPrice is accessible here
    message += `💎 Grand Total: ৳${formatPrice(totalPrice >= 500 ? totalPrice : totalPrice + 50)}\n\n`;
    
    // Additional Notes
    if (customerDetails.additionalNotes) {
      message += `*📝 Customer Notes:*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `${customerDetails.additionalNotes}\n\n`;
    }
    
    // Footer
    message += `*📦 Delivery Information:*\n`;
    message += `• 2-3 business days in Dhaka\n`;
    message += `• 4-7 days outside Dhaka\n`;
    message += `• Contact: +880 1906-884840\n\n`;
    message += `✅ Please confirm this order. Thank you!`;
    
    return encodeURIComponent(message);
  };

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`;

  // Handle form submission and WhatsApp checkout
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Save order to localStorage for reference
    const orderData = {
      customer: customerDetails,
      items: cartItems,
      total: totalPrice,
      timestamp: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`,
    };
    
    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    
    // Open WhatsApp in new tab after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsProcessing(false);
      setShowCustomerForm(false);
    }, 1000);
  };

  // Handle WhatsApp checkout button click
  const handleWhatsAppCheckout = () => {
    setShowCustomerForm(true);
  };

  // ✅ REMOVE THE DUPLICATE formatPrice FUNCTION FROM HERE
  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat("bn-BD").format(price);
  // };

  // Handle quantity increase
  const handleIncrease = (id) => {
    dispatch(increaseQty(id));
  };

  // Handle quantity decrease
  const handleDecrease = (id) => {
    dispatch(decreaseQty(id));
  };

  // Handle item removal
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  return (
    <>
      {/* Customer Form Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaWhatsapp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Complete Your Order</h2>
                    <p className="text-gray-600">Fill in your details to proceed to WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Order Summary Preview */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Order Summary</p>
                    <p className="text-sm text-gray-600">{totalItems} items • ৳{formatPrice(totalPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Shipping: {totalPrice >= 500 ? 'FREE' : '৳50'}</p>
                    <p className="font-bold text-lg text-blue-600">
                      Total: ৳{formatPrice(totalPrice >= 500 ? totalPrice : totalPrice + 50)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerDetails.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+88</span>
                        <input
                          type="tel"
                          name="phone"
                          value={customerDetails.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
                    Delivery Address
                  </h3>
                  <div className="space-y-4">
                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <select
                        name="district"
                        value={customerDetails.district}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.district ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                      )}
                    </div>

                    {/* Address Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Address *
                      </label>
                      <textarea
                        name="address"
                        value={customerDetails.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="House/Road, Area, Thana"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCreditCard className="w-5 h-5 text-purple-600" />
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${customerDetails.paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={customerDetails.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${customerDetails.paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'}`}>
                          {customerDetails.paymentMethod === 'cod' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when you receive</p>
                        </div>
                      </div>
                    </label>

                    <label className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${customerDetails.paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile"
                        checked={customerDetails.paymentMethod === 'mobile'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${customerDetails.paymentMethod === 'mobile' ? 'border-blue-500' : 'border-gray-300'}`}>
                          {customerDetails.paymentMethod === 'mobile' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Mobile Banking</p>
                          <p className="text-sm text-gray-600">Bkash/Nagad/Rocket</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={customerDetails.additionalNotes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaWhatsapp className="w-5 h-5" />
                      Proceed to WhatsApp
                    </>
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-center text-sm text-gray-600">
                You'll be redirected to WhatsApp to confirm your order
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Main Cart Page */}
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 pt-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                <div className="p-3 bg-blue-600 text-white rounded-full">
                  <FaShoppingCart className="w-6 h-6" />
                </div>
                <span>Your Shopping Cart</span>
                {cartItems.length > 0 && (
                  <span className="text-lg font-normal text-gray-600">
                    ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h1>
              
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  Clear Cart
                </button>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Order Summary</p>
                    <p className="text-blue-100">Complete your purchase via WhatsApp</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">৳ {formatPrice(totalPrice)}</p>
                    <p className="text-blue-100 text-sm">{totalItems} items</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Display */}
          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-8xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Looks like you haven't added any books to your cart yet. Start exploring our collection!
              </p>
              <a 
                href="/books" 
                className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <FaShoppingCart />
                Browse Books Collection
              </a>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      {/* Book Info */}
                      <div className="flex items-start gap-4 flex-1 mb-4 md:mb-0">
                        <div className="relative">
                          <img
                            src={item.image || "/book-placeholder.jpg"}
                            alt={item.title}
                            className="w-24 h-32 object-cover rounded-xl shadow-md"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h2 className="font-bold text-xl text-gray-800">{item.title}</h2>
                          <p className="text-gray-600 mb-2">by {item.author || "Unknown Author"}</p>
                          <p className="text-blue-600 font-bold text-xl">৳ {formatPrice(item.price)}</p>
                          <p className="text-green-600 font-medium">
                            Subtotal: ৳ {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
                            <button
                              onClick={() => handleDecrease(item.id)}
                              className={`p-2 rounded-full ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-blue-600 hover:bg-white'}`}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="w-4 h-4" />
                            </button>
                            
                            <span className="font-bold text-lg w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleIncrease(item.id)}
                              className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-white"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            title="Remove from cart"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-linear-to-r from-gray-50 to-blue-50 p-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Items</span>
                          <span className="font-medium">{cartItems.length} different books</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Quantity</span>
                          <span className="font-medium">{totalItems} copies</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items Subtotal</span>
                          <span className="font-medium">৳ {formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium text-green-600">Free (৳500+ order)</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3 mt-3">
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-gray-800">Total Amount</span>
                            <span className="font-bold text-blue-600 text-2xl">৳ {formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h3>
                        <div className="space-y-3 text-gray-600">
                          <p>📦 Free delivery on orders above ৳500</p>
                          <p>⏱️ 2-3 business days in Dhaka</p>
                          <p>📞 Contact: +880 1906-884840</p>
                          <p>💳 Cash on Delivery available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-8">
                <button
                  onClick={handleWhatsAppCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FaWhatsapp className="w-6 h-6" />
                  Proceed to Checkout via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;