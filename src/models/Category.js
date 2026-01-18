// models/Category.js - Updated with Bangla fields
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  banglaName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  banglaDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📚'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  bookCount: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name
categorySchema.pre('save', async function () {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\u0980-\u09FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  this.updatedAt = new Date();
});


// Update book count when books are added/removed
categorySchema.statics.updateBookCount = async function(categoryId) {
  const Book = mongoose.model('Book');
  const category = await this.findById(categoryId);
  
  if (!category) return;

  const stats = await Book.aggregate([
    {
      $match: {
        category: category.name,
        status: { $ne: 'discontinued' }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalSold: { $sum: { $ifNull: ['$soldCount', 0] } },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await this.findByIdAndUpdate(categoryId, {
    bookCount: stats[0]?.count || 0,
    totalSold: stats[0]?.totalSold || 0,
    avgRating: stats[0]?.avgRating ? parseFloat(stats[0].avgRating.toFixed(1)) : 0
  });
};

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;