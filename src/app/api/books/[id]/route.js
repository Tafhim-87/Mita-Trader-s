import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import { deleteImage } from '@/lib/cloudinary';
import { isValidObjectId } from 'mongoose';

// GET - Get single book by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Await params since it's a Promise in Next.js 14
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id).lean();
    
    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book,
    });
    
  } catch (error) {
    console.error('Get book error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update a book
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // ===== Best Of Month limit check =====
    if (updates.bestOfMonth === true) {

      const count = await Book.countDocuments({
        bestOfMonth: true,
        _id: { $ne: id }
      });

      if (count >= 5) {
        return NextResponse.json(
          {
            success: false,
            message: 'Maximum 5 Best Of Month books allowed'
          },
          { status: 400 }
        );
      }
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
    
  } catch (error) {
    console.error('Update book error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Update failed', error: error.message },
      { status: 400 }
    );
  }
}


// DELETE - Delete a book
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Await params
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);
    
    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    // Clean up images in Cloudinary
    if (book.images?.length > 0) {
      try {
        await Promise.allSettled(
          book.images.map(img => deleteImage(img.public_id))
        );
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with deletion even if Cloudinary fails
      }
    }

    await Book.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
    });
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Alternative to PATCH (full update)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid book ID' },
        { status: 400 }
      );
    }

    const bookData = await request.json();

    const existingBook = await Book.findById(id);
    
    if (!existingBook) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    // ===== Best Of Month limit check =====
    if (bookData.bestOfMonth === true) {

      const count = await Book.countDocuments({
        bestOfMonth: true,
        _id: { $ne: id }
      });

      if (count >= 5) {
        return NextResponse.json(
          {
            success: false,
            message: 'Maximum 5 Best Of Month books allowed'
          },
          { status: 400 }
        );
      }
    }

    Object.keys(bookData).forEach(key => {
      existingBook[key] = bookData[key];
    });

    await existingBook.save();

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      data: existingBook,
    });

  } catch (error) {
    console.error('PUT error:', error);

    return NextResponse.json(
      { success: false, message: 'Update failed', error: error.message },
      { status: 400 }
    );
  }
}
