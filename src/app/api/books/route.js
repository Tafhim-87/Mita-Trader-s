export const runtime = "nodejs"; // VERY IMPORTANT

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Book from "@/models/Book";
import cloudinary from "@/lib/cloudinary";

// Allowed sort fields (prevent injection/mistakes)
const ALLOWED_SORT_FIELDS = [
  "createdAt",
  "price",
  "rating",
  "title",
  "averageRating",
  "soldCount",
];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // ── Pagination ───────────────────────────────────────────────
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit")) || 12)
    );
    const skip = (page - 1) * limit;

    // ── Filters ──────────────────────────────────────────────────
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const minPrice = parseFloat(searchParams.get("minPrice"));
    const maxPrice = parseFloat(searchParams.get("maxPrice"));
    const minRating = parseFloat(searchParams.get("minRating"));
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";

    // Build MongoDB query
    const query = {
      status: { $ne: "discontinued" }, // active books only by default
    };

    // Search in title, author, description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category (support comma-separated or single value)
    if (category) {
      const categories = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (categories.length === 1) {
        query.category = categories[0];
      } else if (categories.length > 1) {
        query.category = { $in: categories };
      }
    }

    // Price range
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Minimum rating
    if (!isNaN(minRating)) {
      query.rating = { $gte: Math.max(0, Math.min(5, minRating)) };
    }

    if (featured) query.featured = true;
    if (bestseller) query.bestseller = true;

    // ── Sorting ──────────────────────────────────────────────────
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order")?.toLowerCase() === "asc" ? 1 : -1;

    // Validate sort field
    const validSortField = ALLOWED_SORT_FIELDS.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sort = { [validSortField]: order };

    // ── Execute queries ──────────────────────────────────────────
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-__v -createdAt -updatedAt") // you can adjust fields
      .lean(); // faster if you don't need mongoose documents

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      count: books.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages && books.length === limit,
        hasPrevPage: page > 1,
      },
      data: books,
    });
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching books",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Keep your existing POST route (it's already quite good)
// You can add some small improvements if you want...

// POST - Create a new book
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const files = formData.getAll("images");

    // Basic fields
    const title = formData.get("title");
    const author = formData.get("author");
    const category = formData.get("category");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const originalPrice = Number(formData.get("originalPrice")) || price;
    const stock = Number(formData.get("stock"));

    // Extra fields
    const featured = formData.get("featured") === "true";
    const bestseller = formData.get("bestseller") === "true";
    const bestOfMonth = formData.get("bestOfMonth") === "true";
    const discount = Number(formData.get("discount")) || 0;
    const rating = Number(formData.get("rating")) || 0;
    const totalRatings = Number(formData.get("totalRatings")) || 0;
    const status = formData.get("status") || "active";

    // Validation
    if (!title || !author || !category || !description) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ message: "Images required" }, { status: 400 });
    }

    const uploadedImages = [];

    // Upload images to Cloudinary
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "bookstore/books" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      uploadedImages.push({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }

    // If bestOfMonth is true, reset previous best book
    if (bestOfMonth) {
      await Book.updateMany(
        { bestOfMonth: true },
        { $set: { bestOfMonth: false } }
      );
    }

    // Then create the book
    const book = await Book.create({
      title,
      author,
      category,
      description,
      price,
      originalPrice,
      stock,
      images: uploadedImages,
      featured,
      bestseller,
      bestOfMonth,
      discount,
      rating,
      totalRatings,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        data: book,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// export const runtime = 'nodejs'; // VERY IMPORTANT

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Book from '@/models/Book';
// import cloudinary from '@/lib/cloudinary';
