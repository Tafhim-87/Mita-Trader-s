import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get monthly statistics
    const [monthlyStats, topCategories, trendingBooks] = await Promise.all([
      // Monthly sales statistics
      Book.aggregate([
        {
          $match: {
            status: { $ne: 'discontinued' }
          }
        },
        {
          $group: {
            _id: null,
            totalBooks: { $sum: 1 },
            totalSold: { $sum: { $ifNull: ['$soldCount', 0] } },
            avgRating: { $avg: '$rating' },
            totalFeatured: { $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] } },
            totalBestsellers: { $sum: { $cond: [{ $eq: ['$bestseller', true] }, 1, 0] } },
            totalThisMonth: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $gte: ['$createdAt', startOfMonth] },
                      { $lte: ['$createdAt', endOfMonth] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),

      // Top categories this month
      Book.aggregate([
        {
          $match: {
            status: { $ne: 'discontinued' },
            createdAt: { 
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            totalSold: { $sum: { $ifNull: ['$soldCount', 0] } }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 5
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            avgRating: { $round: ['$avgRating', 1] },
            totalSold: 1,
            _id: 0
          }
        }
      ]),

      // Trending books (this month)
      Book.find({
        status: { $ne: 'discontinued' },
        createdAt: { 
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      })
      .select('title author price rating images category featured bestseller soldCount')
      .sort({ trendingScore: -1, rating: -1 })
      .limit(10)
      .lean()
    ]);

    // Calculate month-over-month growth
    const lastMonthStats = await Book.aggregate([
      {
        $match: {
          status: { $ne: 'discontinued' },
          createdAt: { 
            $gte: startOfLastMonth,
            $lte: endOfLastMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalLastMonth: { $sum: 1 },
          soldLastMonth: { $sum: { $ifNull: ['$soldCount', 0] } }
        }
      }
    ]);

    const stats = monthlyStats[0] || {};
    const lastStats = lastMonthStats[0] || { totalLastMonth: 0, soldLastMonth: 0 };

    const growthRate = lastStats.totalLastMonth > 0 
      ? ((stats.totalThisMonth - lastStats.totalLastMonth) / lastStats.totalLastMonth * 100).toFixed(1)
      : 100;

    return NextResponse.json({
      success: true,
      data: {
        currentMonth: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
        statistics: {
          totalBooks: stats.totalBooks || 0,
          totalSold: stats.totalSold || 0,
          avgRating: stats.avgRating ? parseFloat(stats.avgRating.toFixed(1)) : 0,
          totalFeatured: stats.totalFeatured || 0,
          totalBestsellers: stats.totalBestsellers || 0,
          totalThisMonth: stats.totalThisMonth || 0,
          growthRate: parseFloat(growthRate)
        },
        topCategories,
        trendingBooks,
        timeframe: {
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('GET /api/stats/monthly error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error while fetching monthly statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}