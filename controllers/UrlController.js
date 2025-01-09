const helpers = require('../helpers/helper');
const shortenUrlService = require('../services/ShortenUrlService');
const UrlModel = require('../models/Url');
const { getTodayDate } = require('../helpers/helper');
const flashMessageRenderer = require('../helpers/flashMessageRenderer');

async function store(req, res) {
  const { originalUrl, expiration, visibility } = req.body;

  try {
    if (helpers.isObjectEmpty(req.body)) {
      const errorMessage = [
        {
          type: 'error',
          message: 'Request is empty. Please fill the required fields.',
        },
      ];
      const response = await flashMessageRenderer(
          req,
          errorMessage,
          400,
          'error',
      );
      return res.status(response.code).json(response);
    }

    if (!originalUrl) {
      const errorMessage = [
        {
          type: 'error',
          message: 'Original URL is required.',
        },
      ];
      const response = await flashMessageRenderer(
          req,
          errorMessage,
          400,
          'error',
      );
      return res.status(response.code).json(response);
    }

    if (expiration < getTodayDate(4)) {
      const errorMessage = [
        {
          type: 'error',
          message: 'Expiration date must not be in past.',
        },
      ];

      const response = await flashMessageRenderer(
          req,
          errorMessage,
          400,
          'error',
      );
      return res.status(response.code).json(response);
    }

    const shortenedUrl = await shortenUrlService.shortenUrl(originalUrl);
    const urlData = {
      originalUrl,
      shortenedUrl,
      expiration: expiration ? new Date(expiration) : null,
      visibility: visibility === 'on',
      user: req.user?._id,
    };

    const url = new UrlModel(urlData);
    await url.save();

    let message = [
      {
        type: 'success',
        message: 'URL has been shortened successfully.',
      },
    ];

    let response = await flashMessageRenderer(req, message, 201, 'success');

    response.url = url;

    return res.status(response.code).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).
        json({ type: 'error', message: 'Internal Server Error' });
  }
}

module.exports = {
  store,
};