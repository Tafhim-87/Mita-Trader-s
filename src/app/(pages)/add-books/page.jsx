"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddBook() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "",
    totalRatings: "",
    stock: "",
    featured: false,
    bestseller: false,
    bestOfMonth: false,
    status: "active",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        const cats = Array.isArray(json.data) ? json.data : [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();

    // Append basic fields
    Object.entries(formData).forEach(([key, value]) => {
  if (typeof value === 'boolean' || typeof value === 'number') {
    data.append(key, String(value)); // convert to string
  } else {
    data.append(key, value);
  }
});


    // Append extra fields as JSON
    const extraFields = {
      rating: formData.rating || 0,
      totalRatings: formData.totalRatings || 0,
      originalPrice: formData.originalPrice || 0,
      discount: formData.discount || 0,
      featured: formData.featured,
      bestseller: formData.bestseller,
      bestOfMonth: formData.bestOfMonth,
    };
    data.append("extra", JSON.stringify(extraFields));

    // Append images
    images.forEach((img) => data.append("images", img));

    setUploading(true);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        alert("Book uploaded successfully!");
        router.push("/dashboard/books");
      } else {
        alert(result.message || "Error uploading book");
      }
    } catch (err) {
      alert(err.message || "Server error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/books">
          <button className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100">
            <ArrowLeft size={20} /> Back
          </button>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {uploading ? "Uploading..." : "Save Book"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Info */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select category</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name} {cat.banglaName ? `(${cat.banglaName})` : ""}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label>Total Ratings</label>
                <input
                  type="number"
                  name="totalRatings"
                  value={formData.totalRatings}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer block mb-4 p-4 border-2 border-dashed rounded-lg text-center hover:bg-gray-50">
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm text-gray-600">Click to upload images</p>
            </label>
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img.url} alt={img.name} className="w-full h-32 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
                <div className="mt-1 text-xs text-gray-500">{img.name}</div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleInputChange} /> Bestseller
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="bestOfMonth" checked={formData.bestOfMonth} onChange={handleInputChange} /> Best of Month
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
