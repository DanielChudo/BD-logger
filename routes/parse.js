const express = require('express');
const fs = require('fs');
const parseService = require('../services/parse-service');

const router = express.Router();
const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

router.get('/refresh-prices', async (req, res) => {
  const urls = parseService.getUrls('urls.txt');
  const books = parseService.getBooks();
  for (let i = 0; i < urls.length; i++) {
    const { img, name, price } = await parseService.getBookData(urls[i]);
    if (!(name in books)) {
      books[name] = {
        uuid: parseService.filterName(name),
        minPrice: price,
        maxPrice: price,
        img,
        data: [],
      };
    }
    if (price > books[name].maxPrice) {
      books[name].maxPrice = price;
    }
    if (price < books[name].minPrice) {
      books[name].minPrice = price;
    }
    const date = new Date().toLocaleDateString('ru-Latn', options);
    books[name].data.push({ date, price });
    console.log(`${name.padEnd(30)} | ${price.toString().padEnd(6)} | DONE!`);
  }

  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

  res.redirect('back');
});

module.exports = router;
