const express = require('express');
const fs = require('fs');
const parseService = require('../services/parse-service');

const router = express.Router();

router.get('/refresh-prices', async (req, res) => {
  await parseService.refreshPrices();
  res.redirect('back');
});

module.exports = router;
