/**
 *
 * Temporary solution. Groups voting functionality
 * which will be implemented ONLY in client eventually.
 * This file will be deleted later in the process.
 *
 */

const express = require('express');
const router = express.Router();

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.database);
});

/**
 * Mock voting interface. Shall get data from blockchain,
 * choose candidate, encrypt the choice and
 * send back to blokchain with ring signature.
 */
router.post('/vote', function(req, res, next) {
  res.send('FAIL');
});


module.exports = router;
