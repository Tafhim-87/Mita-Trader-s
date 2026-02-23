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
  const maxQuantity = book.stock || 10;

  // ✅ Convert English number to Bangla number
  const toBanglaNumber = (num) => {
    const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    return num
      .toString()
      .split("")
      .map((digit) => banglaDigits[digit])
      .join("");
  };

  const handleAddToCart = () => {
    if (book.stock <= 0) return;

    const cartItem = {
      id: book._id || book.id,
      title: book.title,
      price: book.price || 0,
      image: book.images?.[0]?.url || "/book-placeholder.jpg",
      author: book.author,
      quantity,
    };

    dispatch(addToCart(cartItem));
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full lg:w-[clamp(280px,50%,400px)] space-y-4">

      {/* Quantity Selector */}
      <div className="
        flex items-center justify-between
        bg-gray-100
        rounded-xl
        px-3 py-2
        sm:px-4 sm:py-3
        lg:px-5 lg:py-3
      ">
        <span className="text-sm sm:text-base lg:text-lg font-medium">
          পরিমাণ:
        </span>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || book.stock <= 0}
            className="
              flex items-center justify-center
              w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
              rounded-full
              bg-white
              shadow-sm
              hover:bg-gray-200
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <FaMinus className="text-xs sm:text-sm" />
          </button>

          <span className="
            w-8 sm:w-10
            text-center
            font-bold
            text-base sm:text-lg lg:text-xl
          ">
            {toBanglaNumber(quantity)}
          </span>

          <button
            onClick={increaseQuantity}
            disabled={quantity >= maxQuantity || book.stock <= 0}
            className="
              flex items-center justify-center
              w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
              rounded-full
              bg-white
              shadow-sm
              hover:bg-gray-200
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <FaPlus className="text-xs sm:text-sm" />
          </button>
        </div>
      </div>

      {/* Add To Cart Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleAddToCart}
        disabled={book.stock <= 0}
        className={`
          w-full
          py-2.5 sm:py-3 lg:py-4
          text-sm sm:text-base lg:text-lg
          rounded-xl
          font-semibold
          flex items-center justify-center gap-2
          transition-all duration-300
          shadow-md
          ${
            book.stock <= 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          }
        `}
      >
        <FaShoppingCart className="text-sm sm:text-base lg:text-lg" />

        <span>
          {book.stock <= 0
            ? "স্টকে নেই"
            : `কার্টে যোগ করুন (${toBanglaNumber(quantity)} টি)`
          }
        </span>
      </motion.button>
    </div>
  );
};

export default AddToCartButton;