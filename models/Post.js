'use strict';

const mongoose = require('mongoose');
const { slugify } = require('../helpers/helper');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 100,
  },
  cover: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  content: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500,
  },
}, { timestamps: true });

postSchema.pre('validate', function(next) {
  this.slug = slugify(this.title);

  next();
});

postSchema.statics.getAllRecords = async function() {
  try {
    return await this.find().sort({ createdAt: -1 });
  } catch (error) {
    console.log('postSchema.statics.getAllRecords', error);
    throw new Error(error);
  }
};

postSchema.statics.paginate = async function(options = {}) {
  const { currentPage = 1, limit = 10 } = options;

  try {
    const posts = await this.aggregate([
      { $sort: { updatedAt: -1 } },
      // { $skip: (currentPage - 1) * limit },
      // { $limit: limit },
    ]).exec();

    const total = posts.length;
    const totalPages = Math.ceil(total / limit);
    const startPage = (currentPage - 1) * limit + 1;
    const endPage = startPage + limit;
    const paginatedItems = posts.slice(startPage, endPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;

    return {
      currentPage,
      limit,
      total,
      totalPages,
      items: paginatedItems,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      onFirstPage: currentPage <= 1,
      hasPages: totalPages > 1,
      generateLinks: baseUrl => {
        const links = {};

        if (hasPrevPage) {
          links.previous = `${baseUrl}?page=${prevPage}`;
        }
        if (hasNextPage) {
          links.next = `${baseUrl}?page=${nextPage}`;
        }

        return links;
      },

    }
  } catch (error) {
    console.log('postSchema.statics.paginate', error);
    throw new Error(error);
  }
};

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
