/* eslint-disable prefer-const */
const Seal = require('node-seal');

(async () => {
  Morfix = await Seal();
  const schemeType = Morfix.SchemeType.BFV;
  const securityLevel = Morfix.SecurityLevel.tc128;
  const polyModulusDegree = 4096; // 4096
  const bitSizes = [36, 36, 37]; // [36, 36, 37];
  const bitSize = 20;
  const encParms = Morfix.EncryptionParameters(schemeType);
  encParms.setPolyModulusDegree(polyModulusDegree);
  encParms.setCoeffModulus(
      Morfix.CoeffModulus.Create(
          polyModulusDegree,
          Int32Array.from(bitSizes),
      ),
  );
  encParms.setPlainModulus(
      Morfix.PlainModulus.Batching(
          polyModulusDegree,
          bitSize,
      ),
  );
  context = Morfix.Context(
      encParms,
      false,
      securityLevel,
  );
  if (!context.parametersSet()) {
    throw new Error('Please try different encryption parameters.');
  }
})();

exports.createKeys = async function() {
  const keyGenerator = Morfix.KeyGenerator(
      context,
  );
  const secretKey = keyGenerator.secretKey();
  const publicKey = keyGenerator.publicKey();
  const secretBase64Key = secretKey.save();
  const publicBase64Key = publicKey.save();
  return [secretBase64Key, publicBase64Key];
};

exports.encryptVote = async function(key, vote) {
  const publicKey = Morfix.PublicKey();
  publicKey.load(context, key.toString());

  const encryptor = Morfix.Encryptor(context, publicKey);
  const encoder = Morfix.IntegerEncoder(context);
  const plaintext = encoder.encodeUInt32(parseInt(vote));
  const encryptedVote = encryptor.encrypt(plaintext);
  return encryptedVote.save();
};

exports.combineVotes = async function(votes, multiplication) {
  const evaluator = Morfix.Evaluator(context);
  let result = Morfix.CipherText();
  result.load(context, votes[0]);
  for (const vote of votes.slice(1)) {
    const votecipher = Morfix.CipherText();
    votecipher.load(context, vote);
    if (multiplication) {
      result = evaluator.multiply(result, votecipher);
    } else {
      result = evaluator.add(result, votecipher);
    }
  }
  return result;
};

exports.decryptResult = function(result, privateKey) {
  const secretKey = Morfix.SecretKey();
  secretKey.load(context, privateKey);

  const decryptor = Morfix.Decryptor(context, secretKey);
  const decryptedResult = decryptor.decrypt(result);
  const decoder = Morfix.IntegerEncoder(context);
  const decoded = decoder.decodeUInt32(decryptedResult);
  return decoded;
};
