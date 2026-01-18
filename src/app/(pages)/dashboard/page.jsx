'use client';

import { 
  BookOpen, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Package,
  Star
} from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/api/categories';
import { Tag } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: booksData } = useBooks({ limit: 5 });
  const { data: categories } = useCategories();

  const stats = [
    {
      title: 'Total Books',
      value: '1,248',
      change: '+12%',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '3,456',
      change: '+8%',
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Categories',
      value: categories?.length || '0',
      change: '+2',
      icon: Package,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Books</h3>
            <Link href="/dashboard/books" className="text-blue-600 hover:text-blue-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {booksData?.data?.slice(0, 5).map((book) => (
              <div key={book._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
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
                  <p className="font-semibold">${book.price}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{book.rating || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
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
            <Link href="/dashboard/orders">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <ShoppingCart className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="font-medium text-purple-700">View Orders</p>
              </div>
            </Link>
            <Link href="/dashboard/analytics">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                <TrendingUp className="mx-auto mb-2 text-yellow-600" size={24} />
                <p className="font-medium text-yellow-700">Analytics</p>
              </div>
            </Link>
          </div>

          {/* Status Summary */}
          <div className="mt-8">
            <h4 className="font-medium mb-4">Inventory Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Books</span>
                <span className="font-semibold">1,048</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="font-semibold text-orange-600">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best Sellers</span>
                <span className="font-semibold text-green-600">42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}