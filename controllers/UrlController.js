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

    let existingDocument = await UrlModel.findOne({
      originalUrl: urlData.originalUrl,
      expiration: urlData.expiration,
    }).exec();

    if (existingDocument) {
      const message = [
        {
          type: 'warning',
          message: `URL already exists.
            Here's the shortened <a class="underline text-blue-600" href="/${existingDocument.shortenedUrl}">URL</a>`,
        },
      ];
      const response = await flashMessageRenderer(
          req,
          message,
          302,
          'warning',
      );

      return res.status(response.code).json(response);
    }

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

async function redirect(req, res) {
  const { shortUrl } = req.params;

  try {
    const existingDocument = await UrlModel.findOne({ shortenedUrl: shortUrl }).exec();

    if (existingDocument === null) {
      return res.status(404).json({ type: 'error', message: 'URL not found' });
    }

    if (existingDocument.expiration && existingDocument.expiration < new Date()) {
      return res.status(410).json({ type: 'error', message: 'URL has expired' });
    }

    if (!existingDocument.visibility) {
      return res.status(403).json({ type: 'error', message: "URL can't be redirected" });
    }

    return res.redirect(302, existingDocument.originalUrl);
  } catch (err) {
    console.error('urlController.redirect', err);
    return res.status(500).json({ type: 'error', message: 'Internal Server Error' });
  }
}

module.exports = {
  store,
  redirect,
};