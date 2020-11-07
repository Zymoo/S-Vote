const express = require('express');
const router = express.Router();
const blockchain = require('../utilities/blockchain');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const accs = await blockchain.getTestAccount();
  const tranCount = await blockchain.getTransactionCount(accs);
  await blockchain.testTransaction(
      '0x6aC3F1604BDF80Af4Bde610617F90b471Cf46D4e');
  res.status(200).send(
      {title: 'S-vote', accounts: accs, transactionCount: tranCount});
});

router.get('/deployAll', async function(req, res, next) {
  blockchain.deployAll();
  res.status(200).send(
      {title: 'S-vote'});
});

router.get('/compileAll', async function(req, res, next) {
  await blockchain.compileAll();
  res.status(200).send(
      {title: 'S-vote'});
});

module.exports = router;
