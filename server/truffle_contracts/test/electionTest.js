const chai = require('chai');
const expect = chai.expect;
const Election = artifacts.require('Election');

contract('Running Election tests', async (accounts) => {
  it('should save and return election key', async () => {
    const instance = await Election.deployed();
    const publicKey = 'TestKey';
    await instance.savePublicKey(publicKey, {from: accounts[1]});
    const result = await instance.getPublicKey({from: accounts[1]});
    assert.equal(result.valueOf(), publicKey);
  });

  it('should save and return candidates', async () => {
    const instance = await Election.deployed();
    const nameParams = ['Jan Kowalski', 'Borys Nowak'];
    const numParams = [1, 1000];
    await instance.saveCandidates(nameParams, numParams, {from: accounts[1]});
    const result = await instance.getCandidates({from: accounts[1]});
    const parsedResult = [result[0].fullName, result[1].fullName,
      parseInt(result[0].number), parseInt(result[1].number)];
    expect(parsedResult).to.deep.equal(nameParams.concat(numParams));
  });

  it('should save and return result', async () => {
    const instance = await Election.deployed();
    const sum = 1;
    const scores = [1, 2, 3];
    const e = '1x2y';
    await instance.saveResult(sum, scores, e, {from: accounts[1]});
    const result = await instance.getResult({from: accounts[1]});
    expect(result[2]).to.deep.equal(e);
  });
});
