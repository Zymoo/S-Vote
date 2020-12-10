const trufflechain = require('./trufflechain');

exports.saveConfig = async function(pubKey, candidates, voters, numbers) {
  await trufflechain.saveElectionKey(pubKey);
  await trufflechain.saveCandidates(candidates, numbers);
};

exports.saveVoterKey = async function(key) {
  await trufflechain.saveVoterKey(key);
};

exports.saveResult = async function(result, scores, ephermal) {
  await trufflechain.saveResult(result, scores, ephermal);
};

exports.saveVote = async function(vote) {
  await trufflechain.saveVoterKey(vote);
};

exports.getVotes = async function() {
  const result = await trufflechain.getVotes();
  return result;
};

exports.getElectionKey = async function() {
  const result = await trufflechain.getElectionKey();
  return result;
};

exports.getCandidates = async function() {
  const result = await trufflechain.getCandidates();
  return result;
};

exports.getResult = async function() {
  const result = await trufflechain.getResult();
  return result;
};
