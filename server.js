const fs = require('fs');
const bookUtils = require('./bookUtils');
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
//
//   for (let i = 0; i < urls.length; i++) {
//     const [name, price] = await bookUtils.getNameAndPrice(urls[i]);
//     if (!(name in books)) {
//       books[name] = { data: [], uuid: bookUtils.filterName(name) };
//     }
//     const date = new Date().toLocaleDateString('ru-Latn', options);
//     books[name].data.push({ date, price });
//     console.log(`${name} | ${price} | DONE!`);
//   }
//
//   fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
// };
// parseUrls();
