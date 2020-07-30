const Block = require('../models/block');

exports.saveConfig = async function(pubKey, candidates, voters) {
  const primes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  const keyTransaction = pubKey;
  let block = new Block({
    tag: 'electionkey',
    content: keyTransaction,
  });
  await block.save();

  let primeCnt = 0;
  for (const candidate of candidates) {
    const candTransaction = candidate.concat(':', primes[primeCnt].toString());
    block = new Block({
      tag: 'candidate',
      content: candTransaction,
    });
    await block.save();
    primeCnt++;
  }

  const votTransaction = JSON.stringify(voters);
  block = new Block({
    tag: 'voters',
    content: votTransaction,
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

exports.saveResult = async function(result) {
  const resultTransaction = JSON.stringify(pubKey);
  const block = new Block({
    tag: 'result',
    content: resultTransaction,
  });
  await block.save();
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

exports.getTaggedBlockchain = async function(tag) {
  const data = await Block.find({tag});
  const blockchain = data.map((block) => block.content);
  return blockchain;
};

exports.printBlockchain = async function() {
  const data = await Block.find();
  const blockchain = data.map((block) => JSON.parse(block.content));
  blockchain.forEach((element) => {
    console.log(element);
  });
};

