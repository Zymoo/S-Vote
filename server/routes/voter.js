/**
 *
 * Defines public interface for voters.
 *
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const database = require('../utilities/database');
const chain = require('../utilities/chain');
const Code = require('../models/code');
const isAuth = require('../utilities/middleware/authJwt').verifyToken;


/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.welcome);
});

/**
 * Registration - requires confirmation through IDnow.
 * Sends back an authentication token, or FAIL
 * in case of failed identity confirmation.
 * @returns {token}
 */
router.post('/register', async (req, res, next) => {
  // In the future this token will be generated by IDnow (or alternative).
  const authCode = await Code.findOne({
    code: req.body.password,
  });
  if (!authCode) {
    return res.sendStatus(403);
  }
  const token = jwt.sign({ip: req.ip},
      req.app.locals.token, {expiresIn: '600 s'});
  res.status(200).json(token);
});

router.post('/authcode', [isAuth], (req, res) => {
  Code.findOneAndDelete({code: req.body.authCode}, (err, code) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Deleted Code : ', code);
    }
  });
  res.status(200).send('Successfuly deleted');
});

// eslint-disable-next-line require-jsdoc
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, (req.app.locals.token).toString(), (err, decoded) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    next();
  });
}

/**
 * Saves given public key on a blockchain after validation of user's token.
 * Sends back status OK or FAIL.
 * @param {token}
 * @param {pubKey}
 * @returns {status}
 */
router.post('/keysave', authenticateToken, async function(req, res, next) {
  const {pubKey} = req.body;
  if (req.app.locals.dbsave) {
    await database.saveVoterKey(pubKey);
  } else {
    await chain.saveVoterKey(pubKey);
  }
  res.status(200).send('Passed authentication & saved key on the blockchain');
});

/**
 * Gets election configuration.
 * @returns {candidates, electionKey}
 */
router.get('/data', async function(req, res, next) {
  let candidates;
  let electionKey;
  if (req.app.locals.dbsave) {
    candidates = await database.getTaggedBlockchain('candidate');
    electionKey = await database.getTaggedBlockchain('electionkey')[0];
  } else {
    candidates = await chain.getCandidates();
    electionKey = await chain.getElectionKey();
  }

  const names = [];
  const numbers = [];

  for (const candidate of candidates) {
    names.push(candidate.split(':')[0]);
    numbers.push(candidate.split(':')[1]);
  }
  const result = {names: names, numbers: numbers, electionKey: electionKey};
  res.status(200).send(result);
});


/**
 * Gets election results.
 * @returns {result}
 */
router.get('/result', async function(req, res, next) {
  let candidates;
  let result;
  if (req.app.locals.dbsave) {
    candidates = await database.getTaggedBlockchain('candidate');
    result = await database.getTaggedBlockchain('result');
  } else {
    candidates = await chain.getCandidates();
    result = await chain.getResult();
  }
  console.log(result);
  res.status(200).send({candidates: candidates, results: result});
});


module.exports = router;
