const chai = require('chai');
const Natural = require('bn.js');
const expect = chai.expect;
const Election = artifacts.require('Election');

contract('Election', async (accounts) => {


  it('initializes the contract with the correct values', function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.address
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return electionInstance.token();
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has token contract address');
      return electionInstance.crowdSale();
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has sale contract address');
    });
  });

  it('should save and return election key', async () => {
    const instance = await Election.deployed();
    const publicKey = 'TestKey';
    await instance.savePublicKey(publicKey, {from: accounts[0]});
    const result = await instance.getPublicKey({from: accounts[1]});
    assert.equal(result.valueOf(), publicKey);
  });

  it('should save and return candidates', async () => {
    const instance = await Election.deployed();
    const nameParams = ['Jan Kowalski', 'Borys Nowak'];
    const numParams = [1, 1000];
    await instance.saveCandidates(nameParams, numParams, {from: accounts[0]});
    const result = await instance.getCandidates({from: accounts[1]});
    const parsedResult = [result[0].fullName, result[1].fullName,
      parseInt(result[0].number), parseInt(result[1].number)];
    expect(parsedResult).to.deep.equal(nameParams.concat(numParams));
  });

  it('should save and return big number result', async () => {
    const instance = await Election.deployed();
    const sum = new Natural('90000000000000000000000000');
    const scores = [1, 2, 3];
    const e = '1x2y';
    await instance.saveResult(sum, scores, e, {from: accounts[0]});
    const result = await instance.getResult({from: accounts[1]});
    expect(result[2]).to.deep.equal(e);
  });
});