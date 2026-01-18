// app/api/upload-test/route.js - Simple test upload
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No image file provided' 
        },
        { status: 400 }
      );
    }
    
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // Return a mock success response
    return NextResponse.json({
      success: true,
      message: 'File received successfully (test)',
      data: {
        url: `https://via.placeholder.com/800x1200`,
        public_id: `test_${Date.now()}`,
        width: 800,
        height: 1200,
        format: file.type.split('/')[1] || 'jpg',
      }
    });
    
  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test upload failed: ' + error.message 
      },
      { status: 500 }
    );
  }
}