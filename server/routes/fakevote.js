/**
 *
 * Temporary solution. Groups voting functionality
 * which will be implemented ONLY in client eventually.
 * This file will be deleted later in the process.
 *
 */

const express = require('express');
const router = express.Router();
const database = require('../utilities/database');
const cryptography = require('../utilities/cryptography');

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.welcome);
});

/**
 * Mock voting interface. Shall get data from blockchain,
 * choose candidate, encrypt the choice and
 * send back to blokchain with ring signature.
 * @param candidate
 */
router.post('/vote', async function(req, res, next) {
  const chosenCandidate = req.body.candidate;
  const candidates = await database.getTaggedBlockchain('candidate');
  const electionKey = await database.getTaggedBlockchain('electionkey');
  for (const candidate of candidates) {
    const candidateName = candidate.split(':')[0];
    console.log(candidateName);
    const candidateNumber = candidate.split(':')[1];
    if (candidateName === chosenCandidate) {
      const encryptedVote = cryptography
          .encryptVote(electionKey[0], candidateNumber);
      await database.saveVote(encryptedVote);
      return res.status(200)
          .send('Choice was encrypted and saved on a blockchain');
    }
  }
  res.status(403).send();
});


module.exports = router;
