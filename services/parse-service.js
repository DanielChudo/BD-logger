const fs = require('fs');
const axios = require('axios').default;
const cheerio = require('cheerio');

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

exports.refreshPrices = async () => {
  const urls = getUrls('urls.txt');
  const books = getBooks();
  let img, name, price;

  for (let i = 0; i < urls.length; i++) {
    if (!urls[i]) {
      continue;
    }

    try {
      ({ img, name, price } = await getBookData(urls[i]));
    } catch (e) {
      console.log(`${urls[i]} | ${e.message}!`);
      continue;
    }

    if (!(name in books)) {
      books[name] = {
        uuid: filterName(name),
        minPrice: price,
        maxPrice: price,
        img,
        data: [],
      };
    }

    if (price > books[name].maxPrice) {
      books[name].maxPrice = price;
    }

    // the book may not be available, price = 0
    if (price && price < books[name].minPrice) {
      books[name].minPrice = price;
    }

    const date = new Date().toLocaleDateString('ru-Latn', options);
    books[name].data.push({ date, price });

    console.log(`${name.padEnd(30)} | ${price.toString().padEnd(6)} | DONE!`);
  }

  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
};

async function getBookData(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const img = $('.book-img').attr('src');
    const name = $('h1[itemprop="name"]').text().trim();
    // in dollars
    const price = Number($('span.sale-price').text().trim().slice(3));

    return { img, name, price };
  } catch (e) {
    throw e;
  }
}

function getUrls(fileName) {
  return fs.readFileSync(fileName, 'utf8').split('\n');
}

function getBooks() {
  let books;
  try {
    books = JSON.parse(fs.readFileSync('books.json', 'utf8'));
  } catch (e) {
    books = {};
  }

  return books;
}

exports.getBooks = getBooks;

function filterName(name) {
  return name.replace(/[^\w]/gi, '');
}

exports.addBook = (fileName, url) => {
  fs.appendFileSync(fileName, `\n${url}`);
};
