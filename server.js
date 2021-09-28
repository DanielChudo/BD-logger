const fs = require('fs');
const bookUtils = require('./bookUtils');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
const PORT = process.env.PORT || 5000;
const books = bookUtils.getBooks();

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('home', {
    books,
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const parseUrls = async () => {
//   const urls = bookUtils.getUrls('urls.txt');
//   const options = {
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//   };

//   for (let i = 0; i < urls.length; i++) {
//     const { img, name, price } = await bookUtils.getBookData(urls[i]);
//     if (!(name in books)) {
//       books[name] = {
//         uuid: bookUtils.filterName(name),
//         minPrice: price,
//         maxPrice: price,
//         img,
//         data: [],
//       };
//     }
//     if (price > books[name].maxPrice) {
//       books[name].maxPrice = price;
//     }
//     if (price < books[name].minPrice) {
//       books[name].minPrice = price;
//     }
//     const date = new Date().toLocaleDateString('ru-Latn', options);
//     books[name].data.push({ date, price });
//     console.log(`${name.padEnd(30)} | ${price.toString().padEnd(6)} | DONE!`);
//   }

//   fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
// };
// parseUrls();
