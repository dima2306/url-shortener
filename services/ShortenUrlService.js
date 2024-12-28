'use strict';

const UrlModel = require('../models/Url');
const { isURL } = require('validator');

module.exports = {
  shortenUrl: async function(originalUrl) {
    if (!isURL(originalUrl)) {
      throw new Error('Invalid URL format.');
    }

    let shortenedUrl;
    let isUnique = false;

    while (!isUnique) {
      shortenedUrl = Math.random().toString(36).substring(2, 8);

      const result = await UrlModel.countDocuments(
          { shortenedUrl: shortenedUrl },
      );

      if (result === 0) {
        isUnique = true;
      }
    }

    return shortenedUrl;
  },
};