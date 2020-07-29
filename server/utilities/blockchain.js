const Block = require('../models/block');

exports.saveConfig = async function(pubKey, candidates, voters) {
  const configTransaction = JSON.stringify({pubKey, candidates, voters});
  const block = new Block({
    tag: 'genesis',
    content: configTransaction,
  });
  await block.save();
};

exports.saveVoterKey = async function(pubKey) {
  const keyTransaction = JSON.stringify(pubKey);
  const block = new Block({
    tag: 'key',
    content: keyTransaction,
  });
  await block.save();
};

exports.saveResult = async function() {

};

exports.saveVote = async function(vote) {
  const voteTransaction = JSON.stringify(vote);
  const block = new Block({
    tag: 'vote',
    content: voteTransaction,
  });
  await block.save();
};

exports.getEncryptedVotes = async function() {
  const data = await Block.find();
  const blockchain = data.map((block) => JSON.parse(block));
  return blockchain;
};

exports.getBlockchain = async function() {
  const data = await Block.find();
  const blockchain = data.map((block) => JSON.parse(block));
  return blockchain;
};

exports.printBlockchain = async function() {
  const data = await Block.find();
  const blockchain = data.map((block) => JSON.parse(block));
  blockchain.forEach((element) => {
    console.log(element);
  });
};

