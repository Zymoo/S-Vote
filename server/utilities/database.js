const Block = require('../models/block');

exports.saveConfig = async function(pubKey, candidates, voters, numbers) {
  const keyTransaction = pubKey;
  let block = new Block({
    tag: 'electionkey',
    content: keyTransaction,
  });
  await block.save();

  let primeCnt = 0;
  for (const candidate of candidates) {
    const candTransaction = candidate.concat(':', numbers[primeCnt].toString());
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

exports.saveResult = async function(result, score, ephermal) {
  const resultTransaction = JSON.stringify(result);
  let block = new Block({
    tag: 'result',
    content: resultTransaction,
  });
  await block.save();

  block = new Block({
    tag: 'score',
    content: JSON.stringify(score),
  });
  await block.save();

  block = new Block({
    tag: 'ephermal',
    content: JSON.stringify(ephermal),
  });
  await block.save();
};

exports.saveVote = async function(vote) {
  const voteTransaction = vote;
  const block = new Block({
    tag: 'vote',
    content: voteTransaction,
  });
  await block.save();
};

exports.getTaggedBlockchain = async function(tag) {
  const data = await Block.find({tag});
  const blockchain = data.map((block) => block.content);
  return blockchain;
};

exports.initRoleDatebase = (role) => {
  role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'shareholder',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log('added \'shareholder\' to roles collection');
      });
      new Role({
        name: 'organizer',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log('added \'organizer\' to roles collection');
      });
    }
  });
};
