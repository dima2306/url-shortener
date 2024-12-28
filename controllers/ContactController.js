'use strict';

const { matchedData } = require('express-validator');

function storeContact(req, res) {
  const data = matchedData(req);

  console.log(data);
}

module.exports = { storeContact };