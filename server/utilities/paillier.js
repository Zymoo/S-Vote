/* eslint-disable require-jsdoc */
const forge = require('node-forge');
const crypto = require('crypto');
const Natural = require('bn.js');

/**
 * Proof of concept of Paillier cryptosystem.
 * However due to an awefuly slow JS BigInt ops,
 * there is no point in developing it any further.
 */
class Paillier {
  constructor(bits) {
    this.bits = bits;
  }

  getPrime() {
    let result;
    forge.prime.generateProbablePrime(this.bits,
        (err, num) => {
          result = num.toString(16);
        });
    result = new Natural(result, 16);
    return result;
  }

  generateFactors() {
    let p;
    let q;
    while (true) {
      p = this.getPrime(this.bits);
      q = this.getPrime(this.bits);
      if (!p.eq(q)) {
        break;
      }
    }
    return [p, q];
  }

  generateKeys() {
    const [p, q] = this.generateFactors(this.bits);
    const n = p.mul(q);
    const lambda = (p.subn(1)).mul(q.subn(1));
    const g = n.addn(1);
    const mu = lambda.invm(n);
    const publicKey = [n, g];
    const privateKey = [lambda, mu];
    return [publicKey, privateKey];
  }

  getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  encryptMessage(message, publicKey) {
    const [n, g] = publicKey;
    const m = new Natural(message);
    if (m.gt(n)) return 0;
    const size = this.getRandomInteger(1, n.byteLength() - 1);
    const rBytes = crypto.randomBytes(size).toString('hex');
    const r = new Natural(rBytes, 16);

    const red = Natural.red(n.mul(n));

    const rRed = r.toRed(red);
    const gRed = g.toRed(red);
    const result = gRed.redPow(m).redMul(rRed.redPow(n));
    return result.toString(10);
  }
};

module.exports = Paillier;
