/* eslint-disable max-len */
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const path = require('path');
const net = require('net');
// linux
// const web3 = new Web3(new Web3.providers.IpcProvider('/users/myuser/.ethereum/geth.ipc', net));
// windows (local testing)
const web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', net));

exports.getTestAccount = async function() {
  const account = await web3.eth.getAccounts();

  return account[0];
};

exports.getTransactionCount = async function(account) {
  return await web3.eth.getTransactionCount(account);
};

exports.testTransaction = async function(sender) {
  web3.eth.sendTransaction(
      {from: sender,
        to: '0x4076918DFc8F87F097a045b3EDB96Ad380992F7E',
        value: '1',
      }, function(err, transactionHash) {
        if (!err) {
          console.log(transactionHash + ' success');
        }
      });
};

exports.deploy = async function() {
  const contractPath = path.join(__dirname, '../blockchain/contracts/test.sol');
  const contractFile = fs.readFileSync(contractPath, 'utf-8');
  const JSONcontract = JSON.stringify({
    language: 'Solidity',
    sources: {
      contractPath: {
        content: contractFile,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  });
  const output = JSON.parse(solc.compile(JSONcontract));
  console.log(output);
  /*
    let compiledContract = solc.compile(contractFile);
    let abi = compiledContract.contracts[':Test'].interface;
    let bytecode = compiledContract.contracts[':Test'].bytecode;

    console.log(abi);
    console.log(bytecode);
    */
  /*
    let contract = new web3.eth.Contract(JSON.parse(abi));
    let accounts = await web3.eth.getAccounts();
    let transaction = contract.deploy({
        data: bytecode
        //,arguments:[web3.utils.asciiToHex('string')]
    });
    transaction.send({
        from: accounts[0],
        gas: '10000'
    }).then(console.log);
    */

  // web3.eth.estimateGas(transaction).then(console.log);
  // console.log(abi);
};


// ipc provider and account address hardcoded
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
// let web3 = new Web3('ws://localhost:8546');
/*
  var net = require('net');
  var web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', net));

  web3.eth.getAccounts().then(accounts => {
    var account = accounts[0];
    web3.eth.getTransactionCount(account).then((a) => console.log(a));
    */

/* var testContract = new web3.eth.Contract([{"inputs":[],"name":"getName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"s","type":"string"}],"name":"setName","outputs":[],"stateMutability":"nonpayable","type":"function"}]);
    var test = testContract.deploy(
      {
        from: account,
        data: '0x608060405234801561001057600080fd5b50610310806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806317d7de7c1461003b578063c47f0027146100be575b600080fd5b610043610179565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610083578082015181840152602081019050610068565b50505050905090810190601f1680156100b05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610177600480360360208110156100d457600080fd5b81019080803590602001906401000000008111156100f157600080fd5b82018360208201111561010357600080fd5b8035906020019184600183028401116401000000008311171561012557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061021b565b005b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102115780601f106101e657610100808354040283529160200191610211565b820191906000526020600020905b8154815290600101906020018083116101f457829003601f168201915b5050505050905090565b8060009080519060200190610231929190610235565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027657805160ff19168380011785556102a4565b828001600101855582156102a4579182015b828111156102a3578251825591602001919060010190610288565b5b5090506102b191906102b5565b5090565b6102d791905b808211156102d35760008160009055506001016102bb565b5090565b9056fea2646970667358221220513d1f3c9946653242cc7e090d570b91bba3a233c3285e52cc86f2416fda678c64736f6c63430006090033',
        gas: '1'
      }, function (e, contract){
        console.log(e, contract);
        if (typeof contract.address !== 'undefined') {
            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        }
    })
    testContract.methods.getName().then(e => console.log(e));
    */

/* web3.eth.sendTransaction(
      {from: account,
      to: '0x42F330204c09546E066BE1478006B034155f2f91',
      value: '1'
          }, function(err, transactionHash) {
    if (!err)
      console.log(transactionHash + ' success');
    });*/
// });
// web3.eth.getBlockNumber().then((a) => console.log(a));
