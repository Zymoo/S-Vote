/**
 *
 * Defines organizer interface. Will require additional authetication.
 *
 */

const express = require('express');
const router = express.Router();
const cryptography = require('../utilities/cryptography');
const blockchain = require('../utilities/blockchain');

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.database);
});

/**
 * Starts the registration phase. Creates election key pair.
 * Sends part of the private key to given addresses by email.
 * Saves election configuration on blockchain.
 * Sends back status OK or FAIL.
 * @param {emailAddresses}
 * @param {shamirNum}
 * @param {candidates}
 * @param {voters}
 * @returns {status}
 */
router.post('/begin', function(req, res, next) {
  cryptography.createKeys()
      .then((result) => {
        console.log('Keys generated'); ;
      });

  res.send('FAIL');
});

/**
 * Ends election period, counts and decrypts results.
 * Publicates the result and its proof on blockchain.
 * Sends back status OK or FAIL.
 * @param {privKey}
 * @returns {status}
 */
router.post('/end', function(req, res, next) {
  
  blockchain.getTestAccount().then(account => {
    blockchain.getTransactionCount(account).then(a => console.log('Transaction count: ' + a));
    blockchain.testTransaction(account);
  });

  //blockchain.deploy();
  res.send('FAIL');
});


module.exports = router;
