'use client'

import { useBestBook } from '@/hooks/useBestBook'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const Hero = () => {
  const { data: book, isLoading, isError } = useBestBook()

  if (isLoading) return <p className="text-center py-20">Loading...</p>
  if (isError || !book) return <p className="text-center py-20">No best book found</p>

  return (
    <section className="relative w-full h-full bg-white overflow-hidden">
      
      {/* 🔵 BACKGROUND DECOR ELEMENTS */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-linear-to-r from-pink-400 to-indigo-400 rounded-full blur-[120px] opacity-40" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-linear-to-r from-indigo-400 to-cyan-400 rounded-full blur-[140px] opacity-30" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-linear-to-r from-purple-400 to-pink-400 rounded-full blur-[120px] opacity-30" />

      <div className="relative container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-indigo-50 text-indigo-600 font-medium">
            📘 Best Book of the Month
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Books That{' '}
            <span className="text-indigo-600">Really Matter</span>
          </h1>

          <p className="text-gray-600 max-w-xl">
            Hand-picked books that help developers grow, learn faster,
            and stay ahead in technology.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {book.title}
            </h2>
            <p className="text-gray-500">by {book.author}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md">
              Buy Now
            </button>
            <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
              Explore Books
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative flex justify-center"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-xl rotate-2">
            <Image
              src={book.images?.[0]?.url || '/hero-image.png'}
              alt={book.title}
              width={520}
              height={660}
              priority
              className="object-cover"
            />

            {/* TEXT OVERLAY */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">
                {book.category?.toUpperCase()} • ⭐ {book.rating}
              </p>

              <div className="flex items-center justify-between mt-2">
                <span className="text-indigo-600 font-bold text-lg">
                  ৳{book.price}
                </span>
                {book.discount && (
                  <span className="text-sm text-green-600 font-medium">
                    {book.discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
