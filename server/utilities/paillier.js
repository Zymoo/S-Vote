/* eslint-disable require-jsdoc */
const forge = require('node-forge');
const crypto = require('crypto');
const Natural = require('bn.js');

/**
 * Proof of concept of Paillier cryptosystem.
 * However due to an awefuly slow JS BigInt ops,
 * tried using bn.js library. Results are much better,
 * yet it is still pretty slow.
 */
class Paillier {
  constructor(bits) {
    this.bits = bits;
  }

  lFunction(x, n) {
    return (x.subn(1)).divRound(n);
  }

  getPrime() {
    return new Promise((resolve, reject) => {
      forge.prime.generateProbablePrime(this.bits, (err, res) => {
        if (err) reject(err.message);
        if (res) resolve(new Natural(res.toString()));
      });
    });
  }

  async generateFactors() {
    let p;
    let q;
    while (true) {
      p = await this.getPrime(this.bits);
      q = await this.getPrime(this.bits);
      if (!p.eq(q)) {
        break;
      }
    }
    return [p, q];
  }

  async generateKeys() {
    const [p, q] = await this.generateFactors(this.bits);
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


  decryptMessage(ciphertext, privateKey, publicKey) {
    const [lambda, mu] = privateKey;
    const n = publicKey[0];
    const c = new Natural(ciphertext);
    const red = Natural.red(n.mul(n));
    const cRed = c.toRed(red);
    const inner = cRed.redPow(lambda).fromRed();
    const m = (this.lFunction(inner, n)).mul(mu).mod(n);
    return m.toString(10);
  }

  combineCiphers(cipherA, cipherB, publicKey) {
    const a = new Natural(cipherA);
    const b = new Natural(cipherB);
    const n = publicKey[0];
    return a.mul(b).mod(n.mul(n));
  }
};

module.exports = Paillier;
