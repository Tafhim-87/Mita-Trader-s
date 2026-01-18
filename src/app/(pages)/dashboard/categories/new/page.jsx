'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/hooks/api/categories';
import Link from 'next/link';

export default function CategoryFormPage({ params }) {
  const router = useRouter();
  const isEdit = params?.id;
  
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    banglaName: '',
    description: '',
    banglaDescription: '',
    icon: '📚',
    color: '#3B82F6',
    isActive: true,
    featured: false,
    order: 0,
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: params.id,
          ...formData,
        });
        alert('Category updated successfully!');
      } else {
        await createMutation.mutateAsync(formData);
        alert('Category created successfully!');
      }
      router.push('/dashboard/categories');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', bg: 'bg-blue-500' },
    { value: '#10B981', label: 'Green', bg: 'bg-green-500' },
    { value: '#F59E0B', label: 'Yellow', bg: 'bg-yellow-500' },
    { value: '#EF4444', label: 'Red', bg: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Purple', bg: 'bg-purple-500' },
    { value: '#EC4899', label: 'Pink', bg: 'bg-pink-500' },
  ];

  const iconOptions = ['📚', '🎨', '🔬', '💻', '🎵', '🎮', '🍳', '⚽', '🚗', '🌿'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/categories">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update category details' : 'Create a new category'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {isLoading ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Fiction, Science"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bangla Name
            </label>
            <input
              type="text"
              name="banglaName"
              value={formData.banglaName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., উপন্যাস, বিজ্ঞান"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full ${color.bg} ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center hover:bg-gray-100 ${
                  formData.icon === icon ? 'bg-gray-100 ring-2 ring-blue-500' : 'bg-gray-50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Or type emoji..."
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Category description..."
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bangla Description
          </label>
          <textarea
            name="banglaDescription"
            value={formData.banglaDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="বর্ণনা..."
            maxLength={500}
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Active Category</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Featured Category</span>
          </label>
        </div>
      </div>
    </div>
  );
}