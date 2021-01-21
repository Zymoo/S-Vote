const Natural = require('bn.js');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const contract = require('truffle-contract');
const contractPath = '../truffle_contracts/build/contracts/Election.json';
const contractJson = require(contractPath);
const config = require('../config.js');
const serverAddress = config.serverAddress;
const contractAddress = config.contractAddress;
// IMPORTANT - after each new migration this adress will change!


const ElectionContract = contract({
  abi: contractJson.abi,
  unlinked_binary: contractJson.bytecode,
});
ElectionContract.setProvider(provider);

exports.saveElectionKey = async function(electionKey) {
  const instance = await ElectionContract.at(contractAddress);
  await instance.savePublicKey(electionKey, {from: serverAddress});
};

exports.saveCandidates = async function(names, numbers) {
  const instance = await ElectionContract.at(contractAddress);
  await instance.saveCandidates(names, numbers, {from: serverAddress});
};

exports.saveVoterKey = async function(key) {
  const instance = await ElectionContract.at(contractAddress);
  await instance.saveVoterKey(key, {from: serverAddress});
  await web3.eth.sendTransaction({from: serverAddress, to: key, value: 1});
};

exports.saveVote = async function(vote) {
  const instance = await ElectionContract.at(contractAddress);
  await instance.saveVote(vote, {from: serverAddress});
};

exports.saveResult = async function(result, scores, ephermal) {
  const instance = await ElectionContract.at(contractAddress);
  const intResult = new Natural(result);
  const intScores = scores.map((x) => new Natural(x));
  await instance
      .saveResult(intResult, intScores, ephermal, {from: serverAddress});
};

exports.getVotes = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const result = await instance.getVotes({from: serverAddress});
  return result;
};

exports.getElectionKey = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const result = await instance.getPublicKey({from: serverAddress});
  return result;
};

exports.getCandidates = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const result = await instance.getCandidates({from: serverAddress});
  const parsedResult = result.map((x) => (x.fullName + ':' + x.number));
  return parsedResult;
};

exports.getResult = async function() {
  const instance = await ElectionContract.at(contractAddress);
  const result = instance.getPublicKey({from: serverAddress});
  return result;
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
