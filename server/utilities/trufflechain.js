const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const contract = require('truffle-contract');
const contractPath = '../truffle_contracts/build/contracts/Election.json';
const contractJson = require(contractPath);
const serverAddress = '0x542E86396c4aBe1394F7B7d5Cec628d5878fC8cD';
const contractAddress = '0x1525b42Cd6Bb18a8bf93De9Dc0d2a20a1B2Be43D';
// IMPORTANT - after each new migration this adress will change!


const ElectionContract = contract({
  abi: contractJson.abi,
  unlinked_binary: contractJson.bytecode,
});
ElectionContract.setProvider(provider);


exports.saveElectionKey = async function() {
  const instance = await ElectionContract.at(contractAddress);
  try {
    const result = await instance
        .savePublicKey('TestKey', {from: serverAddress});
    console.log(result);
  } catch (err) {
    console.log(err);
  };
  return null;
};

exports.saveCandidates = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const nameParams = ['Jan Kowalski', 'Borys Nowak'];
  const numParams = [1, 1000];
  try {
    const result = await instance
        .saveCandidates(nameParams, numParams, {from: serverAddress});
    console.log(result);
  } catch (err) {
    console.log(err);
  };
  return null;
};

// Showcase for interacting with contract on blockchain
exports.testerIncrement = async function() {
  const contractJson = require(
      '../truffle_contracts/build/contracts/Tester.json');
  const contractAddress = '0xa4570D3B5C7aA483DD6f977E7134a4a8bc308cD1';
  const MyContract = contract({
    abi: contractJson.abi,
    unlinked_binary: contractJson.bytecode,
  });
  MyContract.setProvider(provider);
  const instance = await MyContract.at(contractAddress);
  try {
    const result = await instance.
        increment({from: '0x6aC3F1604BDF80Af4Bde610617F90b471Cf46D4e'});
    console.log(result);
  } catch (err) {
    console.log(err);
  };
  return null;
};
