'use strict';

const ejs = require('ejs');
const helpers = require('./helper');

const renderFlashMessage = async (
    request, messageBag, statusCode = 200, type = 'success') => {
  request.flash('messageBag', messageBag);
  return new Promise((resolve, reject) => {
    ejs.renderFile('views/_partials/flash_message.ejs', {
      messages: request.flash('messageBag'),
      helpers: helpers,
    }, (err, str) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve({ type: type, code: statusCode, data: str });
    });
  });
};

module.exports = renderFlashMessage;