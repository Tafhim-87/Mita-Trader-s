"use client";

import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  Users,
  Tag,
} from "lucide-react";
import { useBooks, useAllBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/api/categories";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: booksData } = useBooks({ limit: 5 });
  const { data: allBooks } = useAllBooks();
  const { data: categories } = useCategories();
  
  // State for orders from localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage on component mount
  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  const loadOrdersFromStorage = () => {
    try {
      // Get all orders from localStorage
      const allOrders = [];
      
      // Loop through localStorage to find all orders
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('order_')) {
          try {
            const orderData = JSON.parse(localStorage.getItem(key));
            allOrders.push(orderData);
          } catch (e) {
            console.error('Error parsing order:', e);
          }
        }
      }
      
      // Also check for lastOrder
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        try {
          const lastOrderData = JSON.parse(lastOrder);
          // Check if it's not already in the array
          if (!allOrders.some(o => o.orderId === lastOrderData.orderId)) {
            allOrders.push(lastOrderData);
          }
        } catch (e) {
          console.error('Error parsing lastOrder:', e);
        }
      }
      
      // Sort by date (newest first)
      allOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate order statistics
  const getOrderStats = () => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        orderChange: "+0%",
        revenueChange: "+0%",
        recentOrders: [],
        whatsappOrders: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month orders
    const currentMonthOrders = orders.filter(order => {
      const date = new Date(order.timestamp);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Last month orders
    const lastMonthOrders = orders.filter(order => {
      const date = new Date(order.timestamp);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Calculate revenue
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => 
      sum + (order.total || 0), 0
    );
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => 
      sum + (order.total || 0), 0
    );

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => 
      sum + (order.total || 0), 0
    );

    // Calculate percentage changes
    const orderChange = lastMonthOrders.length 
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1)
      : currentMonthOrders.length > 0 ? 100 : 0;

    const revenueChange = lastMonthRevenue
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : currentMonthRevenue > 0 ? 100 : 0;

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    // Count WhatsApp orders (all orders are from WhatsApp in your case)
    const whatsappOrders = orders.length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      currentMonthOrders: currentMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      orderChange: orderChange > 0 ? `+${orderChange}%` : `${orderChange}%`,
      revenueChange: revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`,
      recentOrders,
      whatsappOrders,
    };
  };

  const stats = getOrderStats();

  const dashboardStats = [
    {
      title: "Total Books",
      value: allBooks?.length?.toLocaleString() || "0",
      change: "+12%",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.orderChange,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "bg-purple-500",
    },
    {
      title: "Total Categories",
      value: categories?.length?.toLocaleString() || "0",
      change: "+2",
      icon: Package,
      color: "bg-yellow-500",
    },
  ];

  const books = Array.isArray(allBooks) ? allBooks : [];

  const activeBooks = books.filter(
    (book) => Number(book.stock ?? 0) > 0,
  ).length;

  const outOfStockBooks = books.filter(
    (book) => Number(book.stock ?? 0) === 0,
  ).length;

  const bestSellers = books.filter((book) => book.bestseller === true).length;

  // Format price function (matching your cart page)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("bn-BD").format(price);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Books and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Books</h3>
            <Link
              href="/dashboard/books"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {booksData?.data?.slice(0, 5).map((book) => (
              <div
                key={book._id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
                  {book.images?.[0]?.url ? (
                    <img
                      src={book.images[0].url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <BookOpen size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">৳{formatPrice(book.price)}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">
                      {book.rating || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button
              onClick={loadOrdersFromStorage}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <span>Refresh</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShoppingCart size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {order.orderId || `Order #${order.orderId?.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleDateString('bn-BD')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ৳{formatPrice(order.total || 0)}
                    </p>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      WhatsApp
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Orders will appear here when customers checkout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions and Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/books/new">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <BookOpen className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="font-medium text-blue-700">Add New Book</p>
              </div>
            </Link>
            <Link href="/dashboard/categories/new">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors cursor-pointer">
                <Tag className="mx-auto mb-2 text-green-600" size={24} />
                <p className="font-medium text-green-700">Add Category</p>
              </div>
            </Link>
          </div>

          {/* WhatsApp Stats */}
          {stats.whatsappOrders > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">WhatsApp Orders</p>
                  <p className="text-xl font-bold text-green-600">{stats.whatsappOrders}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Order Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Today's Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Orders Today:</span>
              <span className="font-semibold">
                {orders.filter(o => {
                  const today = new Date().toDateString();
                  return new Date(o.timestamp).toDateString() === today;
                }).length}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Revenue Today:</span>
              <span className="font-semibold">
                ৳{formatPrice(orders.filter(o => {
                  const today = new Date().toDateString();
                  return new Date(o.timestamp).toDateString() === today;
                }).reduce((sum, o) => sum + (o.total || 0), 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Inventory Status</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Books</span>
              <span className="font-semibold text-lg">{activeBooks}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Out of Stock</span>
              <span className="font-semibold text-lg text-orange-600">
                {outOfStockBooks}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Best Sellers</span>
              <span className="font-semibold text-lg text-green-600">
                {bestSellers}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Categories</span>
              <span className="font-semibold text-lg">
                {categories?.length || 0}
              </span>
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-6 text-xs text-gray-400 border-t pt-4">
            <p>Orders are stored locally in your browser</p>
            <button
              onClick={loadOrdersFromStorage}
              className="text-blue-600 hover:text-blue-700 mt-2"
            >
              ↻ Refresh orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}