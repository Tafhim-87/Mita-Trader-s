// import mongoose from 'mongoose';

// const imageSchema = new mongoose.Schema({
//   public_id: { type: String, required: true },
//   url: { type: String, required: true },
//   width: Number,
//   height: Number,
//   format: String,
// });

// const bookSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Book title is required'],
//     trim: true,
//   },
//   author: {
//     type: String,
//     required: [true, 'Author name is required'],
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   originalPrice: Number,
//   discount: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0,
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0,
//   },
//   totalRatings: {
//     type: Number,
//     default: 0,
//   },
//   stock: {
//     type: Number,
//     default: 0,
//   },
//   images: [imageSchema],
//   featured: {
//     type: Boolean,
//     default: false,
//   },
//   bestseller: {
//     type: Boolean,
//     default: false,
//   },

//   // 🔥 BEST BOOK OF MONTH
//   bestOfMonth: {
//     type: Boolean,
//     default: false,
//     index: true,
//   },
//   bestOfMonthDate: {
//     type: Date,
//   },

//   status: {
//     type: String,
//     enum: ['active', 'out_of_stock', 'discontinued'],
//     default: 'active',
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Middleware
// bookSchema.pre('save', function () {
//   this.updatedAt = new Date();

//   if (this.isModified('bestOfMonth') && this.bestOfMonth === true) {
//     this.bestOfMonthDate = new Date();
//   }

//   if (this.originalPrice && this.price && this.originalPrice > this.price) {
//     this.discount = Math.round(
//       ((this.originalPrice - this.price) / this.originalPrice) * 100
//     );
//   }

//   if (this.stock === 0) {
//     this.status = 'out_of_stock';
//   }
// });

// // Indexes
// bookSchema.index({ rating: -1 });
// bookSchema.index({ createdAt: -1 });
// bookSchema.index({ bestOfMonth: 1, status: 1 });

// const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
// export default Book;


import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String,
  width: Number,
  height: Number,
  format: String,
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 }, // ← add this
  stock: { type: Number, required: true },
  images: [imageSchema],
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  bestOfMonth: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  status: { type: String, enum: ['active','out_of_stock','discontinued'], default: 'active' },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', bookSchema);
