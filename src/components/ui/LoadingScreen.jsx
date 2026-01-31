"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative flex flex-col items-center">
        {/* Animated SVG Book Icon */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Book background */}
          <motion.rect
            x="20"
            y="30"
            width="80"
            height="70"
            rx="8"
            fill="#4F46E5"
            opacity="0.15"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          {/* Main book pages */}
          <motion.rect
            x="28"
            y="38"
            width="64"
            height="54"
            rx="4"
            fill="white"
            stroke="#4F46E5"
            strokeWidth="2"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />

          {/* Page flip animation */}
          <motion.path
            d="M60 38 L92 38 L92 92 L60 92 Z"
            fill="#6366F1"
            opacity="0.7"
            animate={{
              scaleX: [1, 0.3, 1],
              transformOrigin: "left center",
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
          />

          {/* Spine */}
          <rect x="20" y="30" width="8" height="70" rx="4" fill="#4F46E5" />

          {/* Small shine effect */}
          <motion.circle
            cx="100"
            cy="50"
            r="6"
            fill="white"
            opacity="0.6"
            animate={{ cx: [100, 105, 100], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* Text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">
            বইবাজার লোড হচ্ছে...
          </h2>
          <p className="text-gray-600 text-sm">
            আপনার প্রিয় বইগুলো খুঁজে আনছি
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-indigo-500"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}