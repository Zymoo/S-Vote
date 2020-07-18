/**
 * 
 * Entry part of server - defines public interface.
 * 
 */

var express = require('express');
var router = express.Router();

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send('API');
});

module.exports = router;
