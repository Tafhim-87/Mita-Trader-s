'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState([]);

  // ============================
  // Fetch Book
  // ============================

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBook(data.data);
          reset(data.data);
          setImagePreview(data.data.images || []);
        } else {
          setError('Book not found');
        }
      })
      .catch(() => setError('Failed to load book'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  // ============================
  // Submit Update
  // ============================

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message || 'Update failed');
        return;
      }

      alert('Book updated successfully');
      router.push('/dashboard/books');

    } catch (err) {
      alert('Something went wrong');
    }
  };

  // ============================
  // Loading / Error
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-red-50 rounded-xl">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Book</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // Improved UI
  // ============================

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Books</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Edit Book
              </h1>
              <p className="text-gray-600 mt-2">Update book details and information</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {book?.status?.replace('_', ' ') || 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
                  Book Information
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Enter book title"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Author
                      </label>
                      <input
                        {...register('author')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Author name"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        {...register('category')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g., Fiction, Science"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select 
                        {...register('status')} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Grid */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Stock</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Price ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register('price')}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Original Price ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register('originalPrice')}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Discount (%)
                        </label>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                          <input
                            type="number"
                            {...register('discount')}
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      {...register('stock')}
                      className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                      placeholder="Enter book description..."
                    />
                  </div>

                  {/* Badges/Toggles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Book Badges</h3>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            {...register('featured')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">Featured</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            {...register('bestseller')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">Bestseller</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            {...register('bestOfMonth')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">Best of Month</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Update Book
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Images & Preview */}
          <div className="space-y-8">
            
            {/* Images Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Book Images</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {imagePreview.length} images
                </span>
              </div>
              
              <div className="space-y-4">
                {imagePreview.length > 0 ? (
                  imagePreview.map((img, index) => (
                    <div
                      key={img.public_id || index}
                      className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-all"
                    >
                      <div className="aspect-3/4 relative">
                        <Image
                          src={img.url}
                          fill
                          className="object-cover"
                          alt={`Book cover ${index + 1}`}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                        <button
                          type="button"
                          onClick={() => {
                            // Handle image removal
                            const newImages = [...imagePreview];
                            newImages.splice(index, 1);
                            setImagePreview(newImages);
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <button
                type="button"
                className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Upload New Images
              </button>
            </div>

            {/* Quick Stats Preview */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Current Price</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${watch('price') || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-xl font-bold text-green-600">
                    {watch('discount') || '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Stock</span>
                  <span className={`text-xl font-bold ${(watch('stock') || 0) > 10 ? 'text-green-600' : (watch('stock') || 0) > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {watch('stock') || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    watch('status') === 'active' ? 'bg-green-100 text-green-800' :
                    watch('status') === 'out_of_stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {watch('status')?.replace('_', ' ') || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}