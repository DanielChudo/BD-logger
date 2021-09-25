const fs = require('fs');
const bookUtils = require('./bookUtils');
// const express = require('express');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

let allBooks = bookUtils.getAllBooks();
const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};
const urls = bookUtils.getUrls('urls.txt');
const parseUrls = async () => {
  for (let i = 0; i < urls.length; i++) {
    const [name, price] = await bookUtils.getNameAndPrice(urls[i]);
    if (!(name in allBooks)) {
      allBooks[name] = [];
    }
    const date = new Date().toLocaleDateString('ru-Latn', options);
    allBooks[name].push({ date, price });
    console.log(`${name} | DONE!`);
  }

  fs.writeFileSync('allBooks.json', JSON.stringify(allBooks, null, 2));
};
parseUrls();
