const express = require('express');
const fs = require('fs');
const parseService = require('../services/parse-service');

const router = express.Router();

const regexURL =
  /https?:\/\/www\.bookdepository\.com\/[-a-zA-Z0-9()@:%_+.~#?&=]*\/[0-9]*.*/;

router.get('/refresh-prices', async (req, res) => {
  await parseService.refreshPrices();
  res.json({ message: 'Prices refreshed' });
});

router.post('/add-book', async (req, res) => {
  let url = req.body.url;
  url = url.trim();
  if (regexURL.test(url)) {
    parseService.addBook('urls.txt', req.body.url);
    await parseService.refreshPrices();
    res.json({ message: 'Book successfully added' });
  } else {
    res.status(400).json({ message: 'Incorrect url' });
  }
});

module.exports = router;
