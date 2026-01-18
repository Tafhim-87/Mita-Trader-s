// app/api/categories/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Book from '@/models/Book';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\u0980-\u09FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function updateCategoryStats(categoryName) {
  try {
    const stats = await Book.aggregate([
      {
        $match: {
          category: categoryName,
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

    const updateData = {
      bookCount: stats[0]?.count || 0,
      totalSold: stats[0]?.totalSold || 0,
      avgRating: stats[0]?.avgRating ? parseFloat(stats[0].avgRating.toFixed(1)) : 0,
      updatedAt: new Date()
    };

    await Category.findOneAndUpdate({ name: categoryName }, updateData);
    return updateData;
  } catch (error) {
    console.error(`Error updating stats for ${categoryName}:`, error);
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 0;
    const lang = searchParams.get('lang') || 'en';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const isActive = searchParams.get('isActive');
    const parent = searchParams.get('parent');
    const sort = searchParams.get('sort') || 'order';

    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { banglaName: regex },
        { description: regex },
        { banglaDescription: regex }
      ];
    }

    if (featured) query.featured = true;
    if (isActive !== null) query.isActive = isActive === 'true';
    if (parent === 'null') query.parentCategory = null;
    else if (parent) query.parentCategory = parent;

    let sortQuery = {};
    switch (sort) {
      case 'name':       sortQuery = { name: 1 }; break;
      case 'nameDesc':   sortQuery = { name: -1 }; break;
      case 'bookCount':  sortQuery = { bookCount: -1 }; break;
      case 'order':      sortQuery = { order: 1 }; break;
      default:           sortQuery = { createdAt: -1 };
    }

    let categories = await Category.find(query)
      .populate('parentCategory', 'name banglaName slug')
      .sort(sortQuery)
      .lean();

    // Apply language preference
    categories = categories.map(cat => ({
      ...cat,
      displayName: lang === 'bn' && cat.banglaName ? cat.banglaName : cat.name,
      displayDescription: lang === 'bn' && cat.banglaDescription ? cat.banglaDescription : cat.description,
      _id: cat._id.toString()
    }));

    if (limit > 0) {
      categories = categories.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create category (unchanged except minor cleanup)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      name,
      banglaName = '',
      description = '',
      banglaDescription = '',
      image = '',
      icon = '📚',
      color = '#3B82F6',
      parentCategory = null,
      order = 0,
      isActive = true,
      featured = false,
      metaTitle = '',
      metaDescription = ''
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);
    const existing = await Category.findOne({ $or: [{ name: { $regex: new RegExp(`^${name}$`, 'i') } }, { slug }] });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Category "${name}" already exists` },
        { status: 400 }
      );
    }

    let parent = null;
    if (parentCategory) {
      parent = await Category.findById(parentCategory);
      if (!parent) {
        return NextResponse.json({ success: false, message: 'Parent category not found' }, { status: 404 });
      }
    }

    const category = await Category.create({
      name: name.trim(),
      banglaName: banglaName.trim(),
      description: description.trim(),
      banglaDescription: banglaDescription.trim(),
      image,
      icon,
      color,
      parentCategory: parent?._id || null,
      order,
      isActive,
      featured,
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      slug
    });

    await category.populate('parentCategory', 'name banglaName slug');
    await updateCategoryStats(category.name);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// DELETE and PATCH remain mostly unchanged — consider refactoring DELETE to use [id] route

// DELETE - Delete a category
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const moveTo = searchParams.get('moveTo');
    const force = searchParams.get('force') === 'true';

    if (!id && !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category ID or name is required',
          banglaMessage: 'ক্যাটাগরি আইডি বা নাম দিতে হবে'
        },
        { status: 400 }
      );
    }

    // Find category
    const query = id ? { _id: id } : { name: name };
    const category = await Category.findOne(query);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found',
          banglaMessage: 'ক্যাটাগরি পাওয়া যায়নি'
        },
        { status: 404 }
        );
    }

    // Check if category has sub-categories
    const subCategories = await Category.find({ parentCategory: category._id });
    if (subCategories.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. It has ${subCategories.length} sub-categories.`,
          banglaMessage: `ক্যাটাগরি মুছে ফেলা যাবে না। এতে ${subCategories.length}টি উপ-ক্যাটাগরি রয়েছে।`
        },
        { status: 400 }
      );
    }

    // Check if category has books
    const booksCount = await Book.countDocuments({ category: category.name });
    
    if (booksCount > 0 && !force) {
      if (moveTo) {
        // Move books to another category
        const targetCategory = await Category.findOne({ 
          $or: [
            { _id: moveTo },
            { name: moveTo }
          ]
        });

        if (!targetCategory) {
          return NextResponse.json(
            {
              success: false,
              message: 'Target category not found',
              banglaMessage: 'টার্গেট ক্যাটাগরি পাওয়া যায়নি'
            },
            { status: 404 }
          );
        }

        // Update books
        await Book.updateMany(
          { category: category.name },
          { $set: { category: targetCategory.name, updatedAt: new Date() } }
        );

        // Update stats for both categories
        await updateCategoryStats(category.name);
        await updateCategoryStats(targetCategory.name);

      } else {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot delete category. It has ${booksCount} books. Use ?moveTo=categoryId to move books first, or ?force=true to delete anyway.`,
            banglaMessage: `ক্যাটাগরি মুছে ফেলা যাবে না। এতে ${booksCount}টি বই রয়েছে। বইগুলো স্থানান্তর করতে ?moveTo=categoryId ব্যবহার করুন, অথবা জোর করে মুছতে ?force=true ব্যবহার করুন।`
          },
          { status: 400 }
        );
      }
    }

    // Delete category
    await Category.findByIdAndDelete(category._id);

    // If force delete, update book category to empty or default
    if (force && booksCount > 0) {
      await Book.updateMany(
        { category: category.name },
        { $set: { category: 'Uncategorized', updatedAt: new Date() } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      banglaMessage: 'ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে',
      data: {
        id: category._id,
        name: category.name,
        deleted: true,
        booksMoved: moveTo ? booksCount : 0,
        forceDeleted: force
      }
    });

  } catch (error) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error while deleting category',
        banglaMessage: 'ক্যাটাগরি মুছে ফেলার সময় সার্ভার ত্রুটি',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update a category
export async function PATCH(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      id,
      name,
      banglaName,
      description,
      banglaDescription,
      image,
      icon,
      color,
      parentCategory,
      order,
      isActive,
      featured,
      metaTitle,
      metaDescription
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category ID is required',
          banglaMessage: 'ক্যাটাগরি আইডি দিতে হবে'
        },
        { status: 400 }
      );
    }

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found',
          banglaMessage: 'ক্যাটাগরি পাওয়া যায়নি'
        },
        { status: 404 }
      );
    }

    // Check if renaming
    if (name && name !== category.name) {
      // Check if new name already exists
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            message: `Category "${name}" already exists`,
            banglaMessage: `"${name}" ক্যাটাগরি ইতিমধ্যে রয়েছে`
          },
          { status: 400 }
        );
      }

      // Update all books with old category name
      await Book.updateMany(
        { category: category.name },
        { $set: { category: name, updatedAt: new Date() } }
      );

      // Update stats for old category name (will be 0 after rename)
      await updateCategoryStats(category.name);
    }

    // Update category
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (banglaName !== undefined) updateData.banglaName = banglaName.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (banglaDescription !== undefined) updateData.banglaDescription = banglaDescription.trim();
    if (image !== undefined) updateData.image = image;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (parentCategory !== undefined) {
      if (parentCategory === null) {
        updateData.parentCategory = null;
      } else {
        // Validate parent category exists
        const parent = await Category.findById(parentCategory);
        if (!parent) {
          return NextResponse.json(
            {
              success: false,
              message: 'Parent category not found',
              banglaMessage: 'মূল ক্যাটাগরি পাওয়া যায়নি'
            },
            { status: 404 }
          );
        }
        // Prevent circular reference
        if (parent._id.toString() === id) {
          return NextResponse.json(
            {
              success: false,
              message: 'Category cannot be its own parent',
              banglaMessage: 'ক্যাটাগরি নিজের মূল ক্যাটাগরি হতে পারবে না'
            },
            { status: 400 }
          );
        }
        updateData.parentCategory = parent._id;
      }
    }
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (featured !== undefined) updateData.featured = featured;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription.trim();

    // Update slug if name changed
    if (name && name !== category.name) {
      updateData.slug = generateSlug(name);
    }

    updateData.updatedAt = new Date();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name banglaName slug');

    // Update stats if name changed
    if (name && name !== category.name) {
      await updateCategoryStats(name);
    } else {
      await updateCategoryStats(updatedCategory.name);
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      banglaMessage: 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে',
      data: updatedCategory
    });

  } catch (error) {
    console.error('PATCH /api/categories error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category slug already exists',
          banglaMessage: 'এই স্লগ ইতিমধ্যে রয়েছে'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Server error while updating category',
        banglaMessage: 'ক্যাটাগরি আপডেটের সময় সার্ভার ত্রুটি',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}