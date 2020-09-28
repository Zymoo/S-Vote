const chai = require('chai');
const expect = chai.expect;
const Paillier = require('../utilities/paillier');

describe('Paillier with 16b', function() {
  const bits = 16;
  describe('generateFactors', function() {
    it('should return array with p q values', function() {
      const p = new Paillier(bits);
      const result = p.generateFactors();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  describe('generateKeys', function() {
    it('should return array with skey and pkey', function() {
      const p = new Paillier(bits);
      const result = p.generateKeys();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  describe('decryptMessage', function() {
    it('should encrypt and return same decrypted message', function() {
      const p = new Paillier(bits);
      const message = '5';
      const [pubKey, secKey] = p.generateKeys();
      const cipher = p.encryptMessage(message, pubKey);
      const result = p.decryptMessage(cipher, secKey, pubKey);
      expect(result).to.eq(message);
    });
  });

  describe('combineCiphers', function() {
    it('should combine ciphers and decrypt to correct result', function() {
      const p = new Paillier(bits);
      const messageA = '5';
      const messageB = '7';
      const [pubKey, secKey] = p.generateKeys();
      const cipherA = p.encryptMessage(messageA, pubKey);
      const cipherB = p.encryptMessage(messageB, pubKey);
      const comb = p.combineCiphers(cipherA, cipherB, pubKey);
      const result = p.decryptMessage(comb, secKey, pubKey);
      expect(result).to.eq('12');
    });
  });
});
