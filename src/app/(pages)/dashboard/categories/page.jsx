'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Grid,
  List,
  Eye
} from 'lucide-react';
import { useCategories, useDeleteCategory } from '@/hooks/api/categories';
import Link from 'next/link';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // We expect the hook to return the array directly (your current hook does: return data.data)
  const { 
    data: categories = [], 
    isLoading,
    isError,
    error 
  } = useCategories();

  const deleteMutation = useDeleteCategory();

  const handleDelete = async (category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ id: category._id });
      alert('Category deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.banglaName?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 text-lg">Loading categories...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-medium mb-2">Error loading categories</h3>
        <p className="text-red-600">{error?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your book categories</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or Bangla name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>

          <Link href="/dashboard/categories/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm">
              <Plus size={16} />
              Add Category
            </button>
          </Link>
        </div>
      </div>

      {/* Empty / No match states */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          <p className="text-lg mb-2">No categories found</p>
          <p className="text-sm">Create your first category to get started.</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No categories match <strong>"{search}"</strong>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm"
                    style={{ backgroundColor: `${category.color || '#3B82F6'}15` }}
                  >
                    {category.icon || '📚'}
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/categories/edit/${category._id}`}>
                      <button className="p-2 text-gray-500 hover:text-green-600 rounded hover:bg-green-50 transition-colors">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {category.name}
                </h3>
                {category.banglaName && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.banglaName}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 text-center text-sm pt-4 border-t border-gray-100">
                  <div>
                    <div className="font-medium">{category.bookCount ?? 0}</div>
                    <div className="text-gray-500 text-xs mt-0.5">Books</div>
                  </div>
                  <div>
                    <div className="font-medium">{category.avgRating?.toFixed(1) ?? '0.0'}</div>
                    <div className="text-gray-500 text-xs mt-0.5">Rating</div>
                  </div>
                  <div>
                    <div className="font-medium">{category.totalSold ?? 0}</div>
                    <div className="text-gray-500 text-xs mt-0.5">Sold</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {category.featured && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                          style={{ backgroundColor: `${category.color || '#3B82F6'}15` }}
                        >
                          {category.icon || '📚'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          {category.banglaName && (
                            <div className="text-sm text-gray-500">{category.banglaName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {category.bookCount ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.avgRating?.toFixed(1) ?? '0.0'} / 5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/category/${category.slug}`} target="_blank">
                          <button className="p-2 text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <Link href={`/dashboard/categories/edit/${category._id}`}>
                          <button className="p-2 text-gray-500 hover:text-green-600 rounded hover:bg-green-50 transition-colors">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}