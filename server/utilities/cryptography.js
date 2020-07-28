/* eslint-disable prefer-const */
const {Seal} = require('node-seal');
const secrets = require('secrets.js-grempe');


exports.createKeys = async function() {
  const Morfix = await Seal();

  // //////////////////////
  // Encryption Parameters
  // //////////////////////

  // Create a new EncryptionParameters
  const schemeType = Morfix.SchemeType.BFV;
  const securityLevel = Morfix.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
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

  const context = Morfix.Context(
      encParms,
      false,
      securityLevel,
  );

  if (!context.parametersSet()) {
    throw new Error('Please try different encryption parameters.');
  }

  const keyGenerator = Morfix.KeyGenerator(
      context,
  );
  const secretKey = keyGenerator.secretKey();
  const publicKey = keyGenerator.publicKey();
  const secretBase64Key = secretKey.save();
  const publicBase64Key = publicKey.save();
  return [secretBase64Key, publicBase64Key];
};

exports.partKey = function(key, n, k) {
  const shares = secrets.share(secrets.str2hex(key), n, k);
  return shares;
};
