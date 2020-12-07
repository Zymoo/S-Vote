/* eslint-disable require-jsdoc */
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const contract = require('truffle-contract');
// eslint-disable-next-line max-len

const contractJson = require(
    '../truffle_contracts/build/contracts/Election.json');
const contractAddress = '0x7555e10036C2feA9dF695624A2085941B7f8f3f0';
const ElectionContract = contract({
  abi: contractJson.abi,
  unlinked_binary: contractJson.bytecode,
});
ElectionContract.setProvider(provider);


exports.saveElectionKey = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const fromAddress = '0x6aC3F1604BDF80Af4Bde610617F90b471Cf46D4e';
  try {
    const result = await instance
        .savePublicKey('TestKey', {from: fromAddress});
    console.log(result);
  } catch (err) {
    console.log(err);
  };
  return null;
};

exports.saveCandidates = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const fromAddress = '0x6aC3F1604BDF80Af4Bde610617F90b471Cf46D4e';
  const nameParams = ['Jan Kowalski', 'Borys Nowak'];
  const numParams = [1, 1000];
  try {
    const result = await instance
        .saveCandidates(nameParams, numParams, {from: fromAddress});
    console.log(result);
  } catch (err) {
    console.log(err);
  };
  return null;
};

// Showcase for interacting with contract on blockchain
exports.testerIncrement = async function() {
  // eslint-disable-next-line max-len
  const contractJson = require('../truffle_contracts/build/contracts/Tester.json');
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
