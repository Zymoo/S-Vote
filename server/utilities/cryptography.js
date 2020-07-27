const {Seal} = require('node-seal');


exports.createKeys = async function() {
  const Morfix = await Seal();
  const schemeType = Morfix.SchemeType.BFV;
  const securityLevel = Morfix.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = Morfix.EncryptionParameters(schemeType);

  // Set the PolyModulusDegree
  encParms.setPolyModulusDegree(polyModulusDegree);
  // Create a suitable set of CoeffModulus primes
  encParms.setCoeffModulus(
      Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)),
  );
  // Set the PlainModulus to a prime of bitSize 20.
  encParms.setPlainModulus(
      Morfix.PlainModulus.Batching(polyModulusDegree, bitSize),
  );
  const context = Morfix.Context(
      parms, // Encryption Parameters
      true, // ExpandModChain
      securityLevel, // Enforce a security level
  );
  if (!context.parametersSet()) {
    throw new Error(
        'Try different encryption parameters.',
    );
  }

  const keyGenerator = Morfix.KeyGenerator(context);
  const secretKey = keyGenerator.secretKey();
  const publicKey = keyGenerator.publicKey();

  return (secretKey, publicKey);
};
