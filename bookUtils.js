const fs = require('fs');
const needle = require('needle');
const cheerio = require('cheerio');

exports.getNameAndPrice = async (url) => {
  const res = await needle('get', url);
  if (res.statusCode === 200) {
    const $ = cheerio.load(res.body);
    const name = $('h1[itemprop="name"]').text().trim();
    // in dollars
    const price = $('span.sale-price').text().trim().slice(3);

    return [name, price];
  } else {
    console.log('FAILED(((');
  }
};

exports.getUrls = (fileName) => {
  return fs.readFileSync(fileName, 'utf8').split('\n');
};

exports.getBooks = () => {
  let books;
  try {
    books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
  } catch (e) {
    books = {};
  }

  return books;
};

exports.filterName = (name) => {
  return name.replace(/ /g, '').replace(/\./g, '').replace(/,/g, '');
};
