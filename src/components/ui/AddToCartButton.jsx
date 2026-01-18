// components/ui/AddToCartButton.jsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";

const AddToCartButton = ({ book }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = book.stock || 10; // Use actual stock or a limit

  const handleAddToCart = () => {
    if (book.stock <= 0) {
      return;
    }

    const cartItem = {
      id: book._id || book.id,
      title: book.title,
      price: book.price || 0,
      image: book.images?.[0]?.url || "/book-placeholder.jpg",
      author: book.author,
      quantity: quantity, // Use the selected quantity
    };

    dispatch(addToCart(cartItem));
    
    // Reset quantity after adding
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
        <span className="font-medium">পরিমাণ:</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || book.stock <= 0}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-bold text-lg">{quantity}</span>
          
          <button
            onClick={increaseQuantity}
            disabled={quantity >= maxQuantity || book.stock <= 0}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        disabled={book.stock <= 0}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          book.stock <= 0
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <FaShoppingCart />
        <span>
          {book.stock <= 0 
            ? 'স্টকে নেই' 
            : `কার্টে যোগ করুন (${quantity} টি)`}
        </span>
      </motion.button>
    </div>
  );
};

export default AddToCartButton;