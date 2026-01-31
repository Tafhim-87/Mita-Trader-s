"use client";

import { motion } from "framer-motion";

export const HeroSkeleton = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background blobs - same as original */}
      <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full blur-[100px] sm:blur-[120px] opacity-40" />
      <div className="absolute top-1/4 sm:top-1/3 -right-16 sm:-right-24 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full blur-[110px] sm:blur-[140px] opacity-30" />
      <div className="absolute -bottom-10 sm:bottom-0 left-1/4 sm:left-1/3 w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-[100px] sm:blur-[120px] opacity-30" />

      <div className="relative container mx-auto px-5 sm:px-6 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* LEFT CONTENT - Skeleton */}
        <div className="space-y-5 sm:space-y-6 text-center md:text-left">
          {/* Tag pill */}
          <div className="inline-block h-7 w-44 bg-gray-200 rounded-full animate-pulse" />

          {/* Main heading */}
          <div className="space-y-3">
            <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-5/6 bg-gray-200 rounded-lg animate-pulse mx-auto md:mx-0" />
            <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-4/6 bg-gray-200 rounded-lg animate-pulse mx-auto md:mx-0" />
          </div>

          {/* Description */}
          <div className="space-y-2 max-w-lg mx-auto md:mx-0">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>

          {/* Book title & author placeholder */}
          <div className="pt-2 space-y-2">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 sm:pt-6 justify-center md:justify-start">
            <div className="h-12 sm:h-14 w-40 bg-gray-300 rounded-xl animate-pulse" />
            <div className="h-12 sm:h-14 w-44 bg-gray-200 rounded-xl animate-pulse border border-gray-300" />
          </div>
        </div>

        {/* RIGHT - Skeleton book covers (fake Swiper look) */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[5/4] md:aspect-auto md:h-[500px] lg:h-[580px] max-w-full md:max-w-[820px] mx-auto">
          <div className="relative h-full w-full flex justify-center items-center gap-4 sm:gap-6 md:gap-8 overflow-hidden">
            {/* Center (featured) book - bigger */}
            <div className="relative w-[260px] sm:w-[280px] md:w-[320px] lg:w-[340px] h-[380px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex-shrink-0">
              <div className="w-full h-full bg-gray-200 rounded-2xl sm:rounded-3xl animate-pulse shadow-xl" />
              {/* Overlay placeholder */}
              <div className="absolute bottom-4 left-4 right-4 bg-gray-300/80 backdrop-blur-sm rounded-xl p-4 space-y-2">
                <div className="h-6 w-5/6 bg-gray-400 rounded animate-pulse" />
                <div className="h-4 w-3/6 bg-gray-400 rounded animate-pulse" />
              </div>
            </div>

            {/* Side books - smaller & positioned */}
            <div className="hidden sm:block relative w-[220px] md:w-[260px] h-[340px] md:h-[400px] flex-shrink-0 opacity-80 transform rotate-6 translate-x-[-20%] translate-y-[-10%]">
              <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse shadow-lg" />
            </div>

            <div className="hidden sm:block relative w-[220px] md:w-[260px] h-[340px] md:h-[400px] flex-shrink-0 opacity-80 transform -rotate-6 translate-x-[20%] translate-y-[-10%]">
              <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};