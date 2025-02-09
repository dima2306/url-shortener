'use strict';

const { matchedData } = require('express-validator');
const ContactModel = require('../models/Contact');

async function storeContact(req, res) {
  const data = matchedData(req);
  data.user = req.user?._id;

  await ContactModel.create(data).then(() => {
    req.flash('messageBag', [
      {
        type: 'success',
        message: 'Message sent successfully',
      },
    ]);

    return res.redirect('/contact');
  }).catch(error => {
    console.error('storeContact error:', error);

    req.flash('errors', [
      {
        type: 'danger',
        msg: error.msg || 'An error occurred while sending the message',
      },
    ]);

    return res.redirect('/contact');
  });
}

module.exports = { storeContact };