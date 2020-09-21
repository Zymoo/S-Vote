/**
 *
 * Defines organizer interface. Will require additional authetication.
 *
 */

const express = require('express');
const router = express.Router();
const cryptography = require('../utilities/cryptography');
const blockchain = require('../utilities/blockchain');
const nodemailer = require('nodemailer');

/* Debug purpose - sanity check */
router.get('/', function(req, res, next) {
  res.send(req.app.locals.database);
});

/**
 * Starts the registration phase. Creates election key pair.
 * Sends part of the private key to given addresses by email.
 * Saves election configuration on blockchain.
 * Sends back status OK or FAIL.
 * @param {emails}
 * @param {shamir}
 * @param {candidates}
 * @param {voters}
 * @returns {status}
 */
router.post('/begin', async function(req, res, next) {
  const emails = req.body.emails;
  const shamir = req.body.shamir;
  const candidates = req.body.candidates;
  const voters = req.body.voters;
  req.app.locals.shamir = parseInt(shamir);

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '28d4d8b9f0ef74',
      pass: '5376cf56f28273',
    },
  });

  const keys = await cryptography.createKeys();
  console.log('Keys generated');
  const privKey = keys[0];
  const pubKey = keys[1];

  const shares = cryptography.partKey(privKey, emails.length, parseInt(shamir));
  shares.forEach((share, index) => {
    const message = {
      from: 'government@votenow.com',
      to: emails[index],
      subject: 'Secret Key Part',
      text: share};

    transporter.sendMail(message, function(err, info) {
      if (err) {
        console.log('Couldnt send mail');
      } else {
        console.log('Mail was sent');
      }
    });
  });
  const candidateNumbers = req.app.locals.numbers;
  await blockchain.saveConfig(pubKey, candidates, voters, candidateNumbers);
  res.status(200).send(privKey);
});

/**
 * Ends election period, counts and decrypts results.
 * Publicates the result and its proof on blockchain.
 * Sends back status OK or FAIL.
 * @param {privKey}
 * @returns {status}
 */
router.post('/end', async function(req, res, next) {
  req.app.locals.shares.add(req.body.share);
  if (req.app.locals.shares.size >= req.app.locals.shamir) {
    const votes = await blockchain.getTaggedBlockchain('vote');
    const resultcipher = await cryptography.combineVotes(votes, false);
    const privKey = cryptography.combineKey(Array.from(req.app.locals.shares));
    const result = cryptography.decryptResult(resultcipher, privKey);
    // eslint-disable-next-line max-len
    const score = cryptography.calculateScore(result.toString(), req.app.locals.numbers);
    console.log(score);
    await blockchain.saveResult(result.toString(), score);
    return res.status(200).send(result.toString());
  }
  res.status(200).send('Got your part!');
});


module.exports = router;
