const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const parseService = require('./services/parse-service');

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

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', require('./routes/parse'));

app.get('/', (req, res) => {
  res.render('home', {
    books: parseService.getBooks(),
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  parseService.refreshPrices();
  // run parsing every day
  setInterval(parseService.refreshPrices, 86400000);
});
