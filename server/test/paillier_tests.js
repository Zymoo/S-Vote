const chai = require('chai');
const expect = chai.expect;
const Paillier = require('../utilities/paillier');

describe('Paillier', function() {
  describe('generateFactors', function() {
    it('should return array with p q values for 16b', function() {
      const p = new Paillier(16);
      const result = p.generateFactors();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  // describe('generateFactors', function() {
  //   it('should return array with p q values for 1024b', async function() {
  //     const p = new Paillier(1024);
  //     const result = await p.generateFactors();
  //     expect(result).to.be.an('array').of.length(2);
  //   });
  // });

  describe('generateKeys', function() {
    it('should return array with skey and pkey for 16b', function() {
      const p = new Paillier(16);
      const result = p.generateKeys();
      expect(result).to.be.an('array').of.length(2);
    });
  });

  describe('encryptMessage', function() {
    it('should return encrypted message as a string', function() {
      const p = new Paillier(16);
      const message = '5';
      const [pubKey, secKey] = p.generateKeys();
      const result = p.encryptMessage(message, pubKey);
      expect(result).to.be.an('string');
    });
  });
});
