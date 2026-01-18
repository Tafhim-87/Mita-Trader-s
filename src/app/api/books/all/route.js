import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';

export async function GET() {
  try {
    await connectDB();
    
    // Get all books with basic info for display
    const books = await Book.find({})
      .select('title author price rating category images stock discount featured bestseller')
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({
      success: true,
      data: books,
    });
    
  } catch (error) {
    console.error('Get all books error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching books',
        error: error.message 
      },
      { status: 500 }
    );
  }
}