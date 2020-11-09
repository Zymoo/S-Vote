const Tester = artifacts.require('./Tester.sol');

module.exports = function(deployer) {
  deployer.deploy(Tester, 123);
};
