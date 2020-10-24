const secrets = require('secrets.js-grempe');
const CryptoSystem = require('./cryptosystem');
const cryptosystem = new CryptoSystem();

exports.partKey = function(key, n, k) {
  const shares = secrets.share(secrets.str2hex(key), n, k);
  return shares;
};

exports.combineKey = function(privateshares) {
  const comb = secrets.combine(privateshares);
  return secrets.hex2str(comb);
};

exports.calculateScore = function(result, numbers) {
  let sum = result;
  const score = [];
  for (const number of numbers.reverse()) {
    const division = Math.floor((+sum) / (+number));
    if (division > 0) {
      score.push(division);
      sum = (+sum) % (+number);
    }
  }
  return score.reverse();
};

exports.createKeys = async function() {
  return await cryptosystem.createKeys();
};

exports.encryptVote = function(key, vote) {
  return cryptosystem.encryptVote(key, vote);
};

exports.combineVotes = function(votes, publicKey) {
  return cryptosystem.combineVotes(votes, publicKey);
};

exports.decryptResult = function(result, privateKey, publicKey) {
  return cryptosystem.decryptResult(result, privateKey, publicKey);
};

exports.getEphermalKey = function(cipher, privateKey, publicKey) {
  const nonce = cryptosystem.getEphermalKey(cipher, privateKey, publicKey);
  return nonce.toString();
};

