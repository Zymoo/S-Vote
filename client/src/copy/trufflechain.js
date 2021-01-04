var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const contractJson = require('./Election.json');
const contractAddress = '0x408dCace05F96c1631DFcd6dD461e0Fd5A3e5D61';
// IMPORTANT - after each new migration this adress will change!


exports.saveVote = async function(vote, address, privateKey) {
  const MyContract = new web3.eth.Contract((contractJson.abi), contractAddress);
  MyContract.setProvider(provider);
  console.log("QQQ");
  const tx = {
    // this could be provider.addresses[0] if it exists
    from: address, 
    // target address, this could be a smart contract address
    to: contractAddress, 
    // optional if you want to specify the gas limit 
    gas: 105624, 
    // optional if you are invoking say a payable function 
    // value: 2112480000000000,
    // this encodes the ABI of the method and the arguements
    data: MyContract.methods.saveVote(vote).encodeABI() 
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
  signPromise.then((signedTx) => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on("receipt", receipt => {
      console.log(receipt);
    });
    sentTx.on("error", err => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
};
