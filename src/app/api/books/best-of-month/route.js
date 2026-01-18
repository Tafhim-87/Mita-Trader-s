import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';

/**
 * GET → Get Best Book of the Month
 */
export async function GET() {
  try {
    await connectDB();

    const book = await Book.findOne({
      bestOfMonth: true,
      status: { $ne: 'discontinued' },
    }).lean();

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'No best book of the month selected' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * POST → Select Best Book of the Month
 */
export async function POST(request) {
  try {
    await connectDB();
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: 'bookId is required' },
        { status: 400 }
      );
    }

    // Remove previous best book
    await Book.updateMany(
      { bestOfMonth: true },
      { $set: { bestOfMonth: false } }
    );

    const book = await Book.findByIdAndUpdate(
      bookId,
      { bestOfMonth: true },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Best book of the month selected',
      data: book,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT → Change Best Book of the Month
 */
export async function PUT(request) {
  try {
    await connectDB();
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: 'bookId is required' },
        { status: 400 }
      );
    }

    await Book.updateMany(
      { bestOfMonth: true },
      { $set: { bestOfMonth: false } }
    );

    const book = await Book.findByIdAndUpdate(
      bookId,
      { bestOfMonth: true },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Best book of the month updated',
      data: book,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE → Remove Best Book of the Month
 */
export async function DELETE() {
  try {
    await connectDB();

    const result = await Book.updateMany(
      { bestOfMonth: true },
      { $set: { bestOfMonth: false } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No best book to remove' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Best book of the month removed',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
