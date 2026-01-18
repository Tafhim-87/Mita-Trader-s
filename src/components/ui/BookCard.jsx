// components/BookCard.js - Debug Version
'use client';

import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, Heart, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BookCard({ book, viewMode = 'grid' }) {
  console.log('BookCard received:', book); // Debug log
  
  // Check if book is valid
  if (!book || typeof book !== 'object') {
    console.error('Invalid book data:', book);
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 text-center">
        <p className="text-red-500">Invalid book data</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '৳0';
    
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice).replace('BDT', '৳');
  };

  // Calculate discounted price
  const originalPrice = Number(book.price) || 0;
  const discountPercent = Number(book.discount) || 0;
  const discountedPrice = discountPercent > 0 
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-1/ reative">
            <div className="relative aspect-3/4 bg-linear-to-br from-blue-400 to-purple-500">
              {book.images?.[0]?.url ? (
                <Image
                  src={book.images?.[0]?.url}
                  alt={book.title || 'Book'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                  <BookOpen className="w-12 h-12" />
                </div>
              )}
              {discountPercent > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -{discountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-3/4 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="flex-1">
                <Link href={`/books/${book._id || book.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2">
                    {book.title || 'Untitled Book'}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-2">
                  by {book.author || 'Unknown Author'}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(book.rating || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({book.rating || 0})</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{book.category || 'Uncategorized'}</span>
                </div>

                <p className="text-gray-700 line-clamp-2 mb-4">
                  {book.description || 'No description available.'}
                </p>
              </div>

              <div className="text-right mt-4 md:mt-0">
                <div className="mb-2">
                  {discountPercent > 0 && (
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(discountedPrice)}
                  </span>
                </div>
                
                {discountPercent > 0 && (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                    {discountPercent}% ছাড়
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              
              <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <ShoppingBag className="w-5 h-5 mr-2" />
                কার্টে যোগ করুন
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
    >
      {/* Book Cover */}
      <div className="relative aspect-3/4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-purple-500">
          {book.images?.[0]?.url ? (
            <Image
              src={book.images[0].url}
              alt={book.title || 'Book'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <BookOpen className="w-16 h-16" />
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercent}%
            </span>
          )}
          {book.bestseller && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              বেস্টসেলার
            </span>
          )}
          {book.featured && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ফিচার্ড
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/90 rounded-full hover:bg-white">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          কার্টে যোগ করুন
        </button>
      </div>

      {/* Book Details */}
      <div className="p-4">
        <Link href={`/books/${book._id || book.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600">
            {book.title || 'Untitled Book'}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          by {book.author || 'Unknown Author'}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(book.rating || 0) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">({book.rating || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {discountPercent > 0 && (
              <span className="text-sm text-gray-500 line-through block">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(discountedPrice)}
            </span>
          </div>
          
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {book.category || 'Uncategorized'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}