/* eslint-disable require-jsdoc */
const SCcompiler = require('../blockchain/smart-contracts-compiler');
const Web3 = require('web3');
const fs = require('fs-extra');
web3 = new Web3('http://localhost:7545');

const serverAddress = '0xAa20Ca5f1a2B4D72BB3db2F490590dae9743dbD1';
const deploymentAddress = '0x6b57d6241C5e530039E6ea8CFFaF4aB18956dAeA';
// 0xa5EFDe8c0F99b444dFC9c415A98ab93D5Dc2ac9F

exports.getTestAccount = async function() {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
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


exports.compileAll = async function() {
  SCcompiler.compile();
};


exports.deployAll = function() {
  deployContract('Test');
};

function deployContract(contractName) {
  try {
    const input = fs.readFileSync('.\\blockchain\\build\\' +
      contractName + '.json', {encoding: 'utf8', flag: 'r'});
    const interface = JSON.parse(input);
    const bytecode = interface.evm.bytecode.object;
    const contract = new web3.eth.Contract(interface.abi);
    contract.deploy({
      data: bytecode.toString(),
      arguments: [123],
    })
        .send({
          from: deploymentAddress,
          gas: 1500000,
        }, function(error, transactionHash) {
          console.log(transactionHash);
        })
        .on('error', function(error) {
          console.log('Error!');
        })
        .on('transactionHash', function(transactionHash) {
          console.log('Transaction hash:', transactionHash);
        })
        .on('receipt', function(receipt) {
          console.log(receipt.contractAddress);
        })
        .on('confirmation', function(confirmationNumber, receipt) {
          console.log(confirmationNumber);
        })
        .then(function(newContractInstance) {
          console.log('Contract address:', newContractInstance.options.address);
        });
  } catch (err) {
    console.log('Error!');
    return;
  }
};
