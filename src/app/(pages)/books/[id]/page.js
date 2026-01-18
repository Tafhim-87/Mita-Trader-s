// app/books/[id]/page.js
'use client';

import { useState, useEffect, use } from 'react'; // Add 'use' import
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, Star, ShoppingBag, Heart, Share2, Eye,
  Truck, Shield, RefreshCw, BookOpen, Users, Clock,
  Calendar, Globe, Tag, Award, Check, ChevronRight,
  Bookmark, MessageSquare, Facebook, Phone
} from 'lucide-react';
import { useBook, useRelatedBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/api/categories';
import AddToCartButton from '@/components/ui/AddToCartButton';

export default function BookDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params with use()
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Fetch book details
  const { data: book, isLoading, isError } = useBook(id);
  
  // Fetch related books
  const { data: relatedBooks = [] } = useRelatedBooks(id, book?.category, 4);
  
  // Fetch categories for breadcrumb
  const { data: categories = [] } = useCategories({ lang: 'bn' });

  // Format price
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(num).replace('BDT', '৳');
  };

  // Calculate discounted price
  const originalPrice = Number(book?.price) || 0;
  const discount = Number(book?.discount) || 0;
  const finalPrice = discount > 0 
    ? originalPrice * (1 - discount / 100)
    : originalPrice;
  const savings = originalPrice - finalPrice;

  // Handle add to cart
  const handleAddToCart = () => {
    console.log('Added to cart:', { book: book?.title, quantity, price: finalPrice });
    // Add your cart logic here
  };

  // Handle buy now
  const handleBuyNow = () => {
    console.log('Buy now:', { book: book?.title, quantity, price: finalPrice });
    // Add your checkout logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">বইয়ের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">বইটি পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">দুঃখিত, আপনি যে বইটি খুঁজছেন তা পাওয়া যায়নি বা মুছে ফেলা হয়েছে।</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/books')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              সব বই দেখুন
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              পিছনে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">হোম</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/books" className="hover:text-blue-600">বই</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href={`/books?category=${book.category}`} className="hover:text-blue-600">
              {book.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium truncate">{book.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Book Images & Basic Info */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images Section */}
                <div>
                  {/* Main Image */}
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-linear-to-br from-blue-50 to-purple-50 mb-4">
                    {book.images?.[selectedImage]?.url ? (
                      <Image
                        src={book.images[selectedImage].url}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {discount > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{discount}%
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
                  </div>

                  {/* Thumbnails */}
                  {book.images && book.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {book.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedImage === index 
                              ? 'border-blue-500' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="relative w-full h-full bg-gray-100">
                            {img.url && (
                              <Image
                                src={img.url}
                                alt={`${book.title} - ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-gray-600 text-lg mb-4">by {book.author}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(book.rating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-700 font-medium">
                      {book.rating || 0} / 5
                    </span>
                    <span className="mx-3 text-gray-400">•</span>
                    <span className="text-gray-600">
                      {book.reviewCount || 0} রিভিউ
                    </span>
                    <span className="mx-3 text-gray-400">•</span>
                    <span className="text-gray-600">
                      {book.soldCount || 0} কপি বিক্রি
                    </span>
                  </div>

                  {/* Category & Tags */}
                  <div className="flex items-center mb-6">
                    <Tag className="w-5 h-5 text-gray-400 mr-2" />
                    <Link 
                      href={`/books?category=${book.category}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {book.category}
                    </Link>
                    {book.tags && book.tags.length > 0 && (
                      <>
                        <span className="mx-3 text-gray-400">•</span>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    {discount > 0 && (
                      <div className="mb-2">
                        <span className="text-2xl text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="ml-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                          {discount}% ছাড়
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold text-blue-600">
                        {formatPrice(finalPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="ml-4 text-green-600 font-medium">
                          আপনি বাঁচাচ্ছেন: {formatPrice(savings)}
                        </span>
                      )}
                    </div>
                    
                    {book.stock > 0 ? (
                      <div className="text-green-600 flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        স্টকে আছে ({book.stock} কপি)
                      </div>
                    ) : (
                      <div className="text-red-600">স্টকে নেই</div>
                    )}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AddToCartButton book={{
  ...book,
  price: finalPrice
}} />
                    </div>

                    <div className="flex space-x-4 pt-4 border-t">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`flex items-center ${isWishlisted ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        <span className="ml-2">উইশলিস্ট</span>
                      </button>
                      
                      <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <Share2 className="w-5 h-5" />
                        <span className="ml-2">শেয়ার করুন</span>
                      </button>
                      
                      <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <Bookmark className="w-5 h-5" />
                        <span className="ml-2">সেভ করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-xl shadow-lg">
              {/* Tab Headers */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'description', label: 'বিবরণ', icon: BookOpen },
                    { id: 'publisher', label: 'প্রকাশক', icon: Globe },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose max-w-none"
                  >
                    <h3 className="text-xl font-bold mb-4">বইয়ের বিবরণ</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {book.description || 'এই বইয়ের জন্য কোনো বিবরণ পাওয়া যায়নি।'}
                    </p>
                    
                    {book.longDescription && (
                      <>
                        <h4 className="text-lg font-semibold mt-6 mb-3">বিস্তারিত বিবরণ</h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {book.longDescription}
                        </p>
                      </>
                    )}

                    
                  </motion.div>
                )}


                {activeTab === 'publisher' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold mb-6">প্রকাশক তথ্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-4">{book.publisher || 'মিতা ট্রেডার্স '}</h4>
                        <p className="text-gray-700 mb-6">
                          {book.publisherInfo || 'সরকারি নিয়োগ, বেসরকারি নিয়োগ, ব্যাংক নিয়োগ, বিএড, বিপিএড, ডিপিএড, কিন্ডারগার্টেন, স্কুল এবং ইসলামিক বইসমূহ পাওয়া যায়।'}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Facebook className="w-5 h-5 text-gray-400 mr-3" />
                            <Link href={book.facebook || 'https://www.facebook.com/BooksPublisher?rdid=jyNnc2eBrxHbnQM4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AjBKWMjvy%2F#'} target="_blank" rel="noopener noreferrer">
                              <span>Facebook/MitaTraders</span>
                            </Link>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                            <Link href={`tel:${book.phone || '+8801234567890'}`}>
                              <span>{book.phone || '+880 1906-884840'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">ডেলিভারি তথ্য</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">ফ্রি ডেলিভারি</div>
                    <div className="text-sm text-gray-600">৫০০+ টাকার অর্ডারে</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">২-৩ কর্মদিবসে</div>
                    <div className="text-sm text-gray-600">ঢাকা সিটিতে ডেলিভারি</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">৭ দিন রিটার্ন</div>
                    <div className="text-sm text-gray-600">সমস্যা হলে রিটার্ন করুন</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-orange-600 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">১০০% সুরক্ষিত</div>
                    <div className="text-sm text-gray-600">সুরক্ষিত পেমেন্ট</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">সম্পর্কিত বই</h3>
                <div className="space-y-4">
                  {relatedBooks.slice(0, 4).map((relatedBook, index) => (
                    <Link 
                      key={relatedBook._id || index}
                      href={`/books/${relatedBook._id}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 group"
                    >
                      <div className="w-16 h-20 rounded overflow-hidden bg-linear-to-br from-blue-100 to-purple-100 shrink-0">
                        {relatedBook.images?.[0]?.url ? (
                          <Image
                            src={relatedBook.images[0].url}
                            alt={relatedBook.title}
                            width={64}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                          {relatedBook.title}
                        </h4>
                        <p className="text-sm text-gray-600">{relatedBook.author}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-blue-600">
                            {formatPrice(relatedBook.price)}
                          </span>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {relatedBook.rating || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link
                  href={`/books?category=${book.category}`}
                  className="block mt-6 text-center py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  আরও দেখুন
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700">
          <ShoppingBag className="w-6 h-6" />
        </button>
        <button className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700">
          <MessageSquare className="w-6 h-6" />
        </button>
        <button className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700">
          <Share2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}