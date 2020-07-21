/**
 * 
 * Entry part of server - defines public interface for voters.
 * 
 */

var express = require('express');
var router = express.Router();

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.database);
});

/**
 * Registration - requires confirmation through IDnow.
 * Sends back an authentication token, or FAIL in case of failed identity confirmation.
 * @returns {authToken}
 */
router.get('/register', function(req, res, next) {
  res.send("FAIL");
});

/**
 * Saves given public key on a blockchain after validation of user's token.
 * Sends back status OK or FAIL.
 * @param {authToken, pubKey}
 * @returns {status}
 */
router.post('/keysave', function(req, res, next) {
  res.send("FAIL");
});

module.exports = router;
