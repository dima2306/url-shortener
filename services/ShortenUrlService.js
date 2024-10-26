'use strict';

const UrlModel = require("../models/Url");

module.exports = {
    shortenUrl: async function (originalUrl) {
        const shortenedUrl = Math.random().toString(36).substring(2, 8);
        const result = await UrlModel.countDocuments({shortenedUrl: shortenedUrl});
        if (result > 0) {
            return this.shortenUrl(originalUrl);
        }

        return shortenedUrl;
    },
}