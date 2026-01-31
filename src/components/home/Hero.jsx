"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import { HeroSkeleton } from "./HeroSkeleton";

export const Hero = () => {
  const {
    data: monthly,
    isLoading,
    isError,
  } = useBooks({
    limit: 5,
    bestOfMonth: true,
    sortBy: "rating",
    order: "desc",
  });

  const books = monthly?.data ?? [];

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (isError || books.length === 0) {
    return <p className="text-center py-20">No book of the month yet...</p>;
  }

  const featuredBook = books[0];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background blobs - reduced size on mobile */}
      <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full blur-[100px] sm:blur-[120px] opacity-40" />
      <div className="absolute top-1/4 sm:top-1/3 -right-16 sm:-right-24 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full blur-[110px] sm:blur-[140px] opacity-30" />
      <div className="absolute -bottom-10 sm:bottom-0 left-1/4 sm:left-1/3 w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-[100px] sm:blur-[120px] opacity-30" />

      <div className="relative container mx-auto px-5 sm:px-6 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5 sm:space-y-6 text-center md:text-left"
        >
          <span className="inline-block px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full bg-indigo-50 text-indigo-600 font-medium">
            📘 Best Book of the Month
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
           পড়ো বেশি, জানো বেশি,  <span className="text-indigo-600">যাও বেশি দূর।</span>
          </h1>

          <p className="text-gray-600 max-w-lg mx-auto md:mx-0 text-base sm:text-lg">
            হাতে বাছাই করা বই যা তোমাকে বেশি জানতে সাহায্য করে এবং জীবনে বেশি দূর যেতে উৎসাহ দেয়।
          </p>

          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              {featuredBook.title}
            </h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              by {featuredBook.author}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 sm:pt-6 justify-center md:justify-start">
            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg font-medium text-sm sm:text-base">
              Buy Now • ৳{featuredBook.price}
            </button>

            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium text-sm sm:text-base">
              Explore All Books
            </button>
          </div>
        </motion.div>

        {/* RIGHT COVERFLOW SLIDER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative w-full aspect-[4/5] sm:aspect-[5/4] md:aspect-auto md:h-[500px] lg:h-[580px] max-w-full md:max-w-[820px] mx-auto fade-mask"
        >
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 20, // reduced rotation on mobile
              stretch: -25,
              depth: 180, // less depth = better mobile feel
              modifier: 1.2, // slightly softer perspective
              slideShadows: false,
            }}
            breakpoints={{
              0: {
                coverflowEffect: {
                  rotate: 15,
                  stretch: -40,
                  depth: 120,
                  modifier: 1,
                },
              },
              640: {
                coverflowEffect: {
                  rotate: 20,
                  stretch: -30,
                  depth: 160,
                  modifier: 1.2,
                },
              },
              1024: {
                coverflowEffect: {
                  rotate: 25,
                  stretch: -30,
                  depth: 250,
                  modifier: 1.5,
                },
              },
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="h-[90%] w-full"
          >
            {books.map((book) => (
              <SwiperSlide
                key={book._id}
                className="!w-[260px] sm:!w-[280px] md:!w-[300px] lg:!w-[320px]"
              >
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl h-full">
                  {/* Removed bg-white – let the image be the background */}

                  {/* <div className="relative w-full h-[380px] sm:h-[420px] md:h-[460px]"> */}
                    <Image
                      src={book.images?.[0]?.url || "/placeholder-book.jpg"}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
                      className="object-cover" // ← this is key: fills the area, crops if needed
                      priority={book._id === featuredBook._id}
                    />
                  {/* </div> */}

                  {/* Info Overlay – moved slightly higher if needed, semi-transparent bg */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-red-50/85 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      ★ {book.rating?.toFixed(1)} • ৳{book.price}
                    </p>

                    {book.discount > 0 && (
                      <span className="text-green-600 font-medium text-xs sm:text-sm block mt-1">
                        {book.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};
