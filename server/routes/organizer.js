/**
 * 
 * Defines organizer interface. Will require additional authetication.
 * 
 */

var express = require('express');
var router = express.Router();

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.database);
});

/**
 * Starts the registration phase. Creates election key pair.
 * Sends part of the private one to to given addresses by email.
 * Saves election configuration on blockchain.
 * Sends back status OK or FAIL.
 * @param {emailAddresses}
 * @param {shamirNum}
 * @param {candidates}
 * @param {voters}
 * @returns {status}
 */
router.post('/begin', function(req, res, next) {
  res.send("FAIL");
});

/**
 * Ends election period, counts and decrypts results.
 * Publicates the result and its proof on blockchain.
 * Sends back status OK or FAIL.
 * @param {privKey}
 * @returns {status}
 */
router.post('/end', function(req, res, next) {
  res.send("FAIL");
});


module.exports = router;
