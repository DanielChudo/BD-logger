const express = require('express');
const fs = require('fs');
const parseService = require('../services/parse-service');

const router = express.Router();

const regexURL = /https?:\/\/(www\.)?bookdepository\.com\/[-\w]*\/\d+/gi;

router.get('/refresh-prices', async (req, res) => {
  await parseService.refreshPrices();
  res.json({ message: 'Prices refreshed' });
});

router.post('/add-books', async (req, res) => {
  let urls = req.body.urls;
  if (regexURL.test(urls)) {
    parseService.addBooks('urls.txt', urls.match(regexURL).join('\n'));
    await parseService.refreshPrices();
    res.json({ message: 'Books successfully added' });
  } else {
    res.status(400).json({ message: 'Incorrect url' });
  }
});

module.exports = router;
