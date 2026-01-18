import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    await connectDB();

    const contentType = request.headers.get('content-type') || '';
    let bookData = {};
    let uploadedImages = [];

    // ── Handle FormData upload (files + fields)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const files = formData.getAll('images'); // multiple images
      const title = formData.get('title');
      const author = formData.get('author');
      const category = formData.get('category');
      const description = formData.get('description');
      const price = parseFloat(formData.get('price')) || 0;
      const stock = parseInt(formData.get('stock')) || 0;

      if (!title || !author || !category || !description) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields' },
          { status: 400 }
        );
      }

      if (!files || files.length === 0) {
        return NextResponse.json(
          { success: false, message: 'At least one image is required' },
          { status: 400 }
        );
      }

      // Upload each image to Cloudinary
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'bookstore/books',
              resource_type: 'image',
              transformation: [
                { width: 800, height: 1200, crop: 'fill' },
                { quality: 'auto:good' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        uploadedImages.push({
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        });
      }

      bookData = { title, author, category, description, price, stock, images: uploadedImages };
    } else {
      // ── Handle JSON payload (images must be URLs)
      bookData = await request.json();

      if (
        !bookData.title ||
        !bookData.author ||
        !bookData.category ||
        !bookData.description ||
        !bookData.images ||
        !Array.isArray(bookData.images) ||
        bookData.images.length === 0
      ) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields or images' },
          { status: 400 }
        );
      }
    }

    // ── Create Book
    const book = new Book(bookData);
    await book.save();

    return NextResponse.json(
      { success: true, message: 'Book created successfully', data: book },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/books error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
