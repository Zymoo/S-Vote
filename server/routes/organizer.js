/**
 *
 * Defines organizer interface. Will require additional authetication.
 *
 */

const express = require('express');
const router = express.Router();
const cryptography = require('../utilities/cryptography');
const Web3 = require('web3');

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

  //port and account address hardcoded
  let web3 = new Web3('ws://localhost:8032');
  //web3.setProvider('ws://localhost:8032');
  web3.eth.personal.unlockAccount("0x42F330204c09546E066BE1478006B034155f2f91", "")
    .then(console.log('Account unlocked!'));
  //console.log(web3.personal.listAccounts);
  
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
  res.send('FAIL');
});


module.exports = router;
