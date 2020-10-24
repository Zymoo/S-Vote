const chai = require('chai');
const expect = chai.expect;
const Natural = require('bn.js');
const Paillier = require('../utilities/paillier');

describe('Paillier with 2048b', function() {
  const bits = 1024; // 2048
  describe('generateFactors', function() {
    it('should return array with p q values', async function() {
      const p = new Paillier(bits);
      const result = await p.generateFactors();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  describe('generateKeys', function() {
    it('should return array with skey and pkey', async function() {
      const p = new Paillier(bits);
      const result = await p.generateKeys();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  describe('decryptMessage', function() {
    it('should encrypt and return same decrypted message', async function() {
      const p = new Paillier(bits);
      const message = '100000';
      const [secKey, pubKey] = await p.generateKeys();
      const cipher = p.encryptMessage(message, pubKey);
      const result = p.decryptMessage(cipher, secKey, pubKey);
      expect(result).to.eq(message);
    });
  });

  describe('combineCiphers', function() {
    it('should combine ciphers and decrypt to same result', async function() {
      const p = new Paillier(bits);
      const messageA = '5';
      const messageB = '7';
      const [secKey, pubKey] = await p.generateKeys();
      const cipherA = p.encryptMessage(messageA, pubKey);
      const cipherB = p.encryptMessage(messageB, pubKey);
      const comb = p.combineCiphers(cipherA, cipherB, pubKey);
      const result = p.decryptMessage(comb, secKey, pubKey);
      expect(result).to.eq('12');
    });
  });

  describe('proveCorrectness', function() {
    it('should return correct nonce for given ciphertext', async function() {
      const p = new Paillier(bits);
      const message = '5';
      const [secKey, pubKey] = await p.generateKeys();
      const cipher = p.encryptMessage(message, pubKey);
      const pubKeyObj = p.objectifyKey(pubKey);
      const nonce = p.proveCorrectness(cipher, secKey, pubKey);
      const cipherPublic = p
          .encryptInner(pubKeyObj[0], nonce, pubKeyObj[1], message);
      expect(cipher).to.eq(cipherPublic);
    });
  });

  describe('stringify & objectifyKey', function() {
    it('should return proper object representation ', function() {
      const p = new Paillier(bits);
      const secKey = [new Natural(1), new Natural(1)];
      const secKeyStr = p.stringifyKey(secKey);
      const secKeyDeStr = p.objectifyKey(secKeyStr);
      expect(secKey).to.deep.eq(secKeyDeStr);
    });
  });
});
