const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Article Schema
 */
const ArticleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: [{type: String}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Methods
 */
ArticleSchema.method({
});

/**
 * Statics
 */
ArticleSchema.statics = {
  /**
   * Get article
   * @param {ObjectId} id - The objectId of article.
   * @returns {Promise<Article, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((article) => {
        if (article) {
          return article;
        }
        const err = new APIError('No such article exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List article in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of articles to be skipped.
   * @param {number} limit - Limit number of articles to be returned.
   * @returns {Promise<Article[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Article
 */
module.exports = mongoose.model('Article', ArticleSchema);
