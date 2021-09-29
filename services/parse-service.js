const fs = require('fs');
const needle = require('needle');
const cheerio = require('cheerio');

exports.getBookData = async (url) => {
  const res = await needle('get', url);
  if (res.statusCode === 200) {
    const $ = cheerio.load(res.body);
    const img = $('.book-img').attr('src');
    const name = $('h1[itemprop="name"]').text().trim();
    // in dollars
    const price = Number($('span.sale-price').text().trim().slice(3));

    return { img, name, price };
  } else {
    // TODO: добавить throw error при плохой ссылке
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
