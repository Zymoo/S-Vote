/* eslint-disable require-jsdoc */
const forge = require('node-forge');
const crypto = require('crypto');
const Natural = require('bn.js');

/**
 * Proof of concept of Paillier cryptosystem.
 * After switching to bn.js library results are satisfactory.
 */
class Paillier {
  constructor(bits) {
    this.bits = bits/2;
    this.separator = '123456789123456789123456789';
    this.lFunction = function(x, n) {
      return (x.subn(1)).divRound(n);
    };

    this.getPrime = function() {
      return new Promise((resolve, reject) => {
        forge.prime.generateProbablePrime(this.bits, (err, res) => {
          if (err) reject(err.message);
          if (res) resolve(new Natural(res.toString()));
        });
      });
    };

    this.generateFactors = async function() {
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
    };

    this.getRandomInteger = function(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    };
  }

  async generateKeys() {
    const [p, q] = await this.generateFactors();
    const n = p.mul(q);
    const lambda = (p.subn(1)).mul(q.subn(1));
    const g = n.addn(1);
    const mu = lambda.invm(n);
    const publicKey = [n, g];
    const privateKey = [lambda, mu];
    return [this.stringifyKey(privateKey), this.stringifyKey(publicKey)];
  }

  encryptInner(n, r, g, message) {
    const m = new Natural(message);
    const red = Natural.red(n.mul(n));
    const rRed = r.toRed(red);
    const gRed = g.toRed(red);
    const result = gRed.redPow(m).redMul(rRed.redPow(n));
    return result.toString(10);
  }

  encryptMessage(message, publicKey) {
    const [n, g] = this.objectifyKey(publicKey);
    const m = new Natural(message);
    if (m.gt(n)) return 0;
    const size = this.getRandomInteger(1, n.byteLength() - 1);
    const rBytes = crypto.randomBytes(size).toString('hex');
    const r = new Natural(rBytes, 16);
    const result = this.encryptInner(n, r, g, m);
    return result;
  }

  proveCorrectness(ciphertext, privateKey, publicKey) {
    const [lambda] = this.objectifyKey(privateKey);
    const [n] = this.objectifyKey(publicKey);
    const c = new Natural(ciphertext);
    const r = c.mod(n);
    const exponent = n.invm(lambda);
    const red = Natural.red(n);
    const nonce = r.toRed(red).redPow(exponent);
    return nonce.fromRed();
  }

  decryptMessage(ciphertext, privateKey, publicKey) {
    const [lambda, mu] = this.objectifyKey(privateKey);
    const n = this.objectifyKey(publicKey)[0];
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
    const n = this.objectifyKey(publicKey)[0];
    return a.mul(b).mod(n.mul(n));
  }

  stringifyKey(key) {
    const [x, y] = key;
    const line = x.toString() + this.separator + y.toString();
    return line;
  }

  objectifyKey(key) {
    const separatorInx = key.indexOf(this.separator);
    const x = new Natural(key.slice(0, separatorInx));
    const y = new Natural(key.slice(separatorInx + this.separator.length));
    return [x, y];
  }
};

module.exports = Paillier;
