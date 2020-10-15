/* eslint-disable max-len */
const SCcompiler = require('..\\blockchain\\smart-contracts-compiler');
const Web3 = require('web3');
const web3 = new Web3(
    new Web3(new Web3.providers.HttpProvider('http://localhost:8880')),
);
const serverAddress = '0xa5EFDe8c0F99b444dFC9c415A98ab93D5Dc2ac9F';

exports.getTestAccount = async function() {
  const accounts = await web3.eth.getAccounts();

  return accounts[0];
};

exports.getTransactionCount = async function(account) {
  return await web3.eth.getTransactionCount(account);
};

exports.testTransaction = async function(sender) {
  web3.eth.sendTransaction(
      {
        from: sender,
        to: serverAddress,
        value: '1',
      },
      function(err, transactionHash) {
        if (!err) {
          console.log(transactionHash + ' success');
        } else console.log(err);
      },
  );
};


exports.deploy = async function() {
  SCcompiler.compile();
};
