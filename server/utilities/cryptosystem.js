/* eslint-disable require-jsdoc */
const Paillier = require('./paillier');

class CryptoSystem {
  constructor() {
    this.system = new Paillier(2048);
  }

  async createKeys() {
    const keys = await this.system.generateKeys();
    const namedKeys = {secretKey: keys[0], publicKey: keys[1]};
    return namedKeys;
  }

  encryptVote(key, vote) {
    const encryptedVote = this.system.encryptMessage(vote, key);
    return encryptedVote;
  }

  combineVotes(votes, publicKey) {
    let result = votes[0];
    for (const vote of votes.slice(1)) {
      result = this.system.combineCiphers(result, vote, publicKey);
    }
    return result;
  }

  decryptResult(result, privateKey, publicKey) {
    return this.system.decryptMessage(result, privateKey, publicKey);
  }

  getEphermalKey(cipher, privateKey, publicKey) {
    return this.system.proveCorrectness(cipher, privateKey, publicKey);
  }
}

module.exports = CryptoSystem;
