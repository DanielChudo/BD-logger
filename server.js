const fs = require('fs');
const tress = require('tress');
const needle = require('needle');
const cheerio = require('cheerio');

const urls = fs.readFileSync('urls.txt', 'utf8').split('\n');
let results;
try {
  results = JSON.parse(fs.readFileSync('data.json', 'utf8'));
} catch (e) {
  results = {};
}

const q = tress((url, done) => {
  needle.get(url, (err, res) => {
    if (err) {
      throw err;
    }

    const $ = cheerio.load(res.body);
    const vol = $('h1[itemprop="name"]').text().trim();
    // in dollars
    const price = $('span.sale-price').text().trim().slice(3);
    if (!(vol in results)) {
      results[vol] = [];
    }
    results[vol].push({ date: new Date(), price });
    console.log(`${vol} | DONE!`);

    done();
  });
});

q.drain = () => {
  fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
};

q.push(urls);
