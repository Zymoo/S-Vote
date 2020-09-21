const express = require('express');
const router = express.Router();

const blockchain = require('../utilities/blockchain');

/* GET home page. */
router.get('/', function(req, res, next) {
  // for testing purposes
  blockchain.deploy();
  res.render('index', {title: 'S-vote'});
});

module.exports = router;
