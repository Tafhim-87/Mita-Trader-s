// app/page.js - Home Page with Category-wise Books
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, BookOpen, ArrowRight, ChevronRight, 
  TrendingUp, Award, Clock, ShoppingBag,
  Heart, Eye, Tag, Users, Sparkles, Bookmark
} from 'lucide-react';
import { useCategories } from '@/hooks/api/categories';
import { useBooks, useAllBooks } from '@/hooks/useBooks';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = useCategories({
    lang: 'bn',
    isActive: true,
    sort: 'bookCount',
    limit: 8
  });
  
  // Fetch books for each category
  const [categoryBooks, setCategoryBooks] = useState({});
  
  useEffect(() => {
    if (categories.length > 0) {
      // Initialize with first category
      setActiveCategory(categories[0].name);
    }
  }, [categories]);

  // Hero Books (Featured/Bestsellers)
  const { data: heroBooksData } = useBooks({
    featured: true,
    limit: 4,
    sortBy: 'rating',
    order: 'desc'
  });
  const { data: allBooksData } = useAllBooks();

  const heroBooks = heroBooksData?.data || [];

  // Format price
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(num).replace('BDT', '৳');
  };

  // Book Card Component
  const BookCard = ({ book }) => {
    if (!book) return null;

    const originalPrice = Number(book.price) || 0;
    const discount = Number(book.discount) || 0;
    const finalPrice = discount > 0 
      ? originalPrice * (1 - discount / 100)
      : originalPrice;

    return (
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        {/* Book Cover */}
        <Link href={`/books/${book._id}`} className="block">
          <div className="relative aspect-3/4 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-purple-50">
              {book.images?.[0]?.url ? (
                <Image
                  src={book.images[0].url}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-linear-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{discount}%
                </span>
              )}
              {book.bestseller && (
                <span className="bg-linear-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  বেস্টসেলার
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex flex-col gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg">
                  <Heart className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg">
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </Link>

        {/* Book Details */}
        <div className="p-5">
          <Link href={`/books/${book._id}`}>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            by {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(book.rating || 0) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({book.rating || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through block">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(finalPrice)}
              </span>
            </div>
            
            <Link 
              href={`/books/${book._id}`}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              বিস্তারিত
            </Link>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-colors duration-300 pointer-events-none" />
      </motion.div>
    );
  };

  // Category Section
  const CategorySection = ({ category }) => {
    const { data: categoryBooksData, isLoading } = useBooks({
      category: category.name,
      limit: 6,
      sortBy: 'rating',
      order: 'desc'
    });

    const books = categoryBooksData?.data || [];

    if (books.length === 0) return null;

    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {category.displayName || category.name}
              </h2>
            </div>
            <p className="text-gray-600">
              {category.bookCount || 0}+ বই এই ক্যাটাগরিতে
            </p>
          </div>
          
          <Link
            href={`/books?category=${category.name}`}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            সব দেখুন
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-medium">বাংলাদেশের বৃহত্তম অনলাইন বইয়ের দোকান</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              পড়ুন, জানুন,
              <span className="block text-yellow-300">বিকশিত হোন</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              ১০,০০০+ বইয়ের বিশাল সংগ্রহ থেকে আপনার পছন্দের বই খুঁজে নিন।
              হোম ডেলিভারি সহ দেশব্যাপী সেবা।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/books"
                className="px-8 py-4 bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:shadow-2xl transition-shadow flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                সব বই দেখুন
              </Link>
              <Link
                href="/books?featured=true"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                ফিচার্ড বই
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      {heroBooks.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                <Award className="w-8 h-8 text-yellow-500 inline mr-3" />
                ফিচার্ড বইসমূহ
              </h2>
              <p className="text-gray-600">এই সপ্তাহের সবচেয়ে জনপ্রিয় বইগুলো</p>
            </div>
            <Link
              href="/books?featured=true"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              আরও দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heroBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: allBooksData?.length || 0, label: 'বই' },
              { icon: Users, value: '৫,০০০+', label: 'পাঠক' },
              { icon: Tag, value: categories?.length || 0, label: 'ক্যাটাগরি' },
              { icon: Clock, value: '২৪/৭', label: 'সাপোর্ট' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Categories Navigation */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ক্যাটাগরি অনুযায়ী বই
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                সব ক্যাটাগরি
              </button>
              
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    activeCategory === category.name
                      ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.displayName || category.name}
                  <span className="ml-2 text-sm opacity-80">
                    ({category.bookCount || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Loading */}
        {categoriesLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">ক্যাটাগরি লোড হচ্ছে...</p>
          </div>
        ) : (
          /* Show all categories or selected category */
          activeCategory === 'all' 
            ? categories.map((category) => (
                <CategorySection key={category._id} category={category} />
              ))
            : categories
                .filter(cat => cat.name === activeCategory)
                .map((category) => (
                  <CategorySection key={category._id} category={category} />
                ))
        )}

        {/* CTA Section */}
        <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white text-center mt-20">
          <h3 className="text-3xl font-bold mb-4">
            আপনার পছন্দের বই এখনই সংগ্রহ করুন
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ৫০০+ টাকার অর্ডারে ফ্রি ডেলিভারি এবং ৭ দিনের রিটার্ন পলিসি
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/books"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              সব বই ব্রাউজ করুন
            </Link>
            <Link
              href="/books?bestseller=true"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              বেস্টসেলার দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">দ্রুত ডেলিভারি</h4>
              <p className="text-gray-400">ঢাকা শহরে ২৪ ঘন্টায়, অন্যান্য বিভাগে ২-৩ কর্মদিবসে</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">সুরক্ষিত পেমেন্ট</h4>
              <p className="text-gray-400">SSL সিকিউরড পেমেন্ট গেটওয়ে দিয়ে নিরাপদ লেনদেন</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">২৪/৭ সাপোর্ট</h4>
              <p className="text-gray-400">যেকোনো সমস্যায় কল করুন: ০১৬XX-XXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}