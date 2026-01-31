"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  RefreshCw,
  Loader2,
  Tag,
  Award,
  Flame,
} from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/api/categories";

const SORT_OPTIONS = [
  { id: "createdAt", label: "নতুন প্রকাশিত", icon: Clock },
  { id: "title", label: "নাম (A-Z)", icon: BookOpen },
  { id: "rating", label: "রেটিং", icon: Star },
  { id: "price", label: "দাম (কম থেকে বেশি)", icon: DollarSign },
  { id: "priceDesc", label: "দাম (বেশি থেকে কম)", icon: DollarSign },
  { id: "soldCount", label: "বেস্টসেলার", icon: TrendingUp },
];

const PRICE_RANGES = [
  { min: 0, max: 200, label: "২০০ টাকার নিচে" },
  { min: 200, max: 500, label: "২০০ - ৫০০ টাকা" },
  { min: 500, max: 1000, label: "৫০০ - ১০০০ টাকা" },
  { min: 1000, max: 2000, label: "১০০০ - ২০০০ টাকা" },
  { min: 2000, max: 5000, label: "২০০০ - ৫০০০ টাকা" },
  { min: 5000, max: 10000, label: "৫০০০ - ১০০০০ টাকা" },
];

const RATING_OPTIONS = [
  { value: 4.5, label: "৪.৫+ ⭐", count: 5 },
  { value: 4, label: "৪.০+ ⭐", count: 4 },
  { value: 3.5, label: "৩.৫+ ⭐", count: 3.5 },
  { value: 3, label: "৩.০+ ⭐", count: 3 },
];

export default function BooksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    category: [],
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sortBy: "createdAt",
    order: "desc",
    featured: false,
    bestseller: false,
  });

  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    special: true,
  });

  // Get categories for filter
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(
    {
      lang: "bn",
      isActive: true,
      sort: "bookCount",
    }
  );

  // Parse URL on mount
  useEffect(() => {
    const params = {
      page: 1,
      limit: 12,
      search: "",
      category: [],
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "createdAt",
      order: "desc",
      featured: false,
      bestseller: false,
    };

    // Parse URL parameters
    searchParams.forEach((value, key) => {
      if (key === "category") {
        params[key] = value.split(",").filter(Boolean);
      } else if (key === "page" || key === "limit") {
        const num = parseInt(value);
        if (!isNaN(num)) params[key] = num;
      } else if (key === "minPrice" || key === "maxPrice") {
        const num = parseFloat(value);
        if (!isNaN(num)) params[key] = num.toString();
      } else if (key === "minRating") {
        const num = parseFloat(value);
        if (!isNaN(num)) params[key] = num.toString();
      } else if (key === "sortBy") {
        params[key] = value;
      } else if (key === "order") {
        params[key] = value;
      } else if (key === "featured" || key === "bestseller") {
        params[key] = value === "true";
      } else if (key === "search") {
        params[key] = value;
      }
    });

    setFilters(params);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    // Only add non-default values to URL
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category.length > 0) params.set("category", newFilters.category.join(","));
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.minRating) params.set("minRating", newFilters.minRating.toString());
    if (newFilters.sortBy !== "createdAt") params.set("sortBy", newFilters.sortBy);
    if (newFilters.order !== "desc") params.set("order", newFilters.order);
    if (newFilters.featured) params.set("featured", "true");
    if (newFilters.bestseller) params.set("bestseller", "true");
    if (newFilters.page > 1) params.set("page", newFilters.page.toString());
    if (newFilters.limit !== 12) params.set("limit", newFilters.limit.toString());

    const url = `/books?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [router]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: 1 // Reset to first page when filters change
      };
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange("search", filters.search);
  };

  const toggleCategory = (categoryName) => {
    const newCategories = filters.category.includes(categoryName)
      ? filters.category.filter(cat => cat !== categoryName)
      : [...filters.category, categoryName];
    
    handleFilterChange("category", newCategories);
  };

  const handlePriceRange = (min, max) => {
    const newFilters = {
      ...filters,
      minPrice: min.toString(),
      maxPrice: max.toString(),
      page: 1,
    };
    
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      page: 1,
      limit: 12,
      search: "",
      category: [],
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "createdAt",
      order: "desc",
      featured: false,
      bestseller: false,
    };
    
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch books with filters
  const { data: booksData, isLoading, isError, refetch } = useBooks({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    category: filters.category.length > 0 ? filters.category : undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
    sortBy: filters.sortBy,
    order: filters.sortBy === "priceDesc" ? "desc" : 
           filters.sortBy === "price" ? "asc" : 
           filters.order,
    featured: filters.featured || undefined,
    bestseller: filters.bestseller || undefined,
  });

  const books = booksData?.data || [];
  const pagination = booksData?.pagination || {};

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price || 0)
      .replace("BDT", "৳");
  };

  // SMALLER BOOK CARD COMPONENT - Consistent Height
  const BookCard = ({ book, viewMode = "grid" }) => {
    const originalPrice = Number(book.price) || 0;
    const discount = Number(book.discount) || 0;
    const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    if (viewMode === "list") {
      return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-all h-full">
          <div className="flex flex-col md:flex-row h-full">
            {/* Book Cover - Smaller */}
            <Link href={`/books/${book._id}`} className="md:w-1/5">
              <div className="relative h-40 md:h-full bg-gradient-to-br from-gray-100 to-gray-200">
                {book.images?.[0]?.url ? (
                  <img
                    src={book.images[0].url}
                    alt={book.title}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
            </Link>

            {/* Book Details */}
            <div className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <Link href={`/books/${book._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2 text-sm">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-xs mb-2 line-clamp-1">{book.author}</p>

                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(book.rating || 0) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-600">({book.rating || 0})</span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      {discount > 0 && (
                        <span className="text-xs text-gray-500 line-through block">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                    <Link
                      href={`/books/${book._id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      বিস্তারিত
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // GRID VIEW - Smaller and Consistent Height
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-all h-full flex flex-col">
        {/* Book Cover - Smaller */}
        <Link href={`/books/${book._id}`} className="block">
          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {book.images?.[0]?.url ? (
              <img
                src={book.images[0].url}
                alt={book.title}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-300" />
              </div>
            )}

            {/* Badges - Smaller */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                  -{discount}%
                </span>
              )}
              {book.bestseller && (
                <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                  বেস্টসেলার
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Book Details - Fixed Height Container */}
        <div className="p-3 flex flex-col flex-1">
          <Link href={`/books/${book._id}`}>
            <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2 text-sm min-h-[2.5rem]">
              {book.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-xs mb-2 line-clamp-1">{book.author}</p>

          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(book.rating || 0) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">({book.rating || 0})</span>
          </div>

          {/* Price and Button - Fixed at bottom */}
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                {discount > 0 && (
                  <span className="text-xs text-gray-500 line-through block">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                <span className="text-base font-bold text-blue-600">
                  {formatPrice(finalPrice)}
                </span>
              </div>

              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {book.category}
              </span>
            </div>

            {/* View Details Button - Always visible, smaller */}
            <Link
              href={`/books/${book._id}`}
              className="block w-full mt-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 text-center"
            >
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">সমস্ত বই</h1>
            <p className="text-lg mb-8">
              {pagination.totalItems
                ? `${pagination.totalItems} বই পাওয়া গেছে`
                : "আপনার পছন্দের বই খুঁজুন"}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                placeholder="বই, লেখক বা ক্যাটাগরি খুঁজুন..."
                className="w-full px-6 py-4 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow"
            >
              <Filter className="w-5 h-5 mr-2" />
              ফিল্টার
              {showFilters ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="lg:w-1/4"
              >
                <div className="bg-white overflow-auto rounded-xl shadow-lg p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">ফিল্টার</h2>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      রিসেট
                    </button>
                  </div>

                  {/* Sort Options */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">সর্ট করুন</h3>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Categories Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleSection("categories")}
                    >
                      <h3 className="font-bold">ক্যাটাগরি</h3>
                      {expandedSections.categories ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedSections.categories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {categoriesLoading ? (
                            <div className="text-center py-4">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            </div>
                          ) : (
                            categories.slice(0, 8).map((category) => (
                              <label
                                key={category._id}
                                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.category.includes(category.name)}
                                  onChange={() => toggleCategory(category.name)}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="ml-3 flex-1">
                                  {category.displayName || category.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({category.bookCount || 0})
                                </span>
                              </label>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Range Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleSection("price")}
                    >
                      <h3 className="font-bold">দাম</h3>
                      {expandedSections.price ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedSections.price && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-sm text-gray-600 mb-1 block">
                                ন্যূনতম
                              </label>
                              <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 mb-1 block">
                                সর্বোচ্চ
                              </label>
                              <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                placeholder="10000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            {PRICE_RANGES.map((range) => (
                              <button
                                key={`${range.min}-${range.max}`}
                                onClick={() => handlePriceRange(range.min, range.max)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                  filters.minPrice === range.min.toString() &&
                                  filters.maxPrice === range.max.toString()
                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Rating Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleSection("rating")}
                    >
                      <h3 className="font-bold">রেটিং</h3>
                      {expandedSections.rating ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {expandedSections.rating && (
                        <motion.div
                          key="rating-filter"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2">
                            {RATING_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() =>
                                  handleFilterChange(
                                    "minRating",
                                    filters.minRating === option.value.toString()
                                      ? ""
                                      : option.value.toString()
                                  )
                                }
                                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition ${
                                  filters.minRating === option.value.toString()
                                    ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <span className="flex items-center">
                                  {option.label}
                                </span>
                                {filters.minRating === option.value.toString() && (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Special Filters Section */}
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleSection("special")}
                    >
                      <h3 className="font-bold">বিশেষ ফিল্টার</h3>
                      {expandedSections.special ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedSections.special && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={filters.featured}
                              onChange={(e) =>
                                handleFilterChange("featured", e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-3 flex items-center">
                              <Award className="w-4 h-4 mr-2 text-blue-500" />
                              ফিচার্ড বই
                            </span>
                          </label>

                          <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={filters.bestseller}
                              onChange={(e) =>
                                handleFilterChange("bestseller", e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-3 flex items-center">
                              <Flame className="w-4 h-4 mr-2 text-orange-500" />
                              বেস্টসেলার
                            </span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Active Filters Display */}
            {(filters.search || 
              filters.category.length > 0 || 
              filters.minRating || 
              filters.minPrice || 
              filters.maxPrice || 
              filters.featured || 
              filters.bestseller) && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">সক্রিয় ফিল্টার:</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    সব সরান
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      সার্চ: "{filters.search}"
                      <button
                        onClick={() => handleFilterChange("search", "")}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {filters.category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {cat}
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="ml-2 hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.minRating && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      <Star className="w-3 h-3 mr-1" />
                      {filters.minRating}+ রেটিং
                      <button
                        onClick={() => handleFilterChange("minRating", "")}
                        className="ml-2 hover:text-yellow-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {filters.minPrice || "০"} - {filters.maxPrice || "∞"} টাকা
                      <button
                        onClick={() => {
                          handleFilterChange("minPrice", "");
                          handleFilterChange("maxPrice", "");
                        }}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {filters.featured && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <Award className="w-3 h-3 mr-1" />
                      ফিচার্ড
                      <button
                        onClick={() => handleFilterChange("featured", false)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {filters.bestseller && (
                    <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      <Flame className="w-3 h-3 mr-1" />
                      বেস্টসেলার
                      <button
                        onClick={() => handleFilterChange("bestseller", false)}
                        className="ml-2 hover:text-orange-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {isLoading
                    ? "লোড হচ্ছে..."
                    : `${pagination.totalItems || 0} বই পাওয়া গেছে`}
                </h2>
                {!isLoading && books.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    দেখানো হচ্ছে {(filters.page - 1) * filters.limit + 1} -{" "}
                    {Math.min(
                      filters.page * filters.limit,
                      pagination.totalItems || 0
                    )}{" "}
                    নং বই
                  </p>
                )}
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <span className="text-gray-600">ভিউ:</span>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3">বইগুলো লোড হচ্ছে...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <div className="text-red-500 mb-4">ত্রুটি হয়েছে</div>
                <p className="text-gray-600 mb-6">
                  বইগুলো লোড করতে সমস্যা হচ্ছে
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}

            {/* Books Display */}
            {!isLoading && !isError && (
              <>
                {books.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      কোন বই পাওয়া যায়নি
                    </h3>
                    <p className="text-gray-600 mb-6">
                      আপনার নির্বাচিত ফিল্টারে কোনো বই নেই
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      সব ফিল্টার সরান
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Grid Layout - More columns for smaller cards */}
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                          : "space-y-4"
                      }
                    >
                      {books.map((book, index) => (
                        <motion.div
                          key={book._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="h-full"
                        >
                          <BookCard book={book} viewMode={viewMode} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-12 flex justify-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleFilterChange("page", filters.page - 1)}
                            disabled={filters.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                          >
                            পূর্ববর্তী
                          </button>

                          {[...Array(Math.min(5, pagination.totalPages))].map(
                            (_, i) => {
                              let pageNum;
                              if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (filters.page <= 3) {
                                pageNum = i + 1;
                              } else if (
                                filters.page >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = filters.page - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handleFilterChange("page", pageNum)}
                                  className={`px-4 py-2 rounded-lg ${
                                    filters.page === pageNum
                                      ? "bg-blue-600 text-white"
                                      : "border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          <button
                            onClick={() => handleFilterChange("page", filters.page + 1)}
                            disabled={filters.page >= pagination.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                          >
                            পরবর্তী
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}