const express = require('express');
const router = express.Router();
const blockchain = require('../utilities/blockchain');
const trufflechain = require('../utilities/trufflechain');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({title: 'S-vote'});
});

router.get('/deployLow', async function(req, res, next) {
  blockchain.deployAll();
  res.status(200).send(
      {title: 'S-vote'});
});

router.get('/compileLow', async function(req, res, next) {
  await blockchain.compileAll();
  res.status(200).send(
      {title: 'S-vote'});
});


router.get('/truffle', async function(req, res, next) {
  await trufflechain.saveElectionKey();
  const result = await trufflechain.saveCandidates();
  res.status(200).send({title: 'S-vote', result: result});
});

module.exports = router;
