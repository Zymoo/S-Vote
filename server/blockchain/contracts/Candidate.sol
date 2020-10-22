// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7;

contract Candidate {
    
    string name;
    int primeNumber;

    constructor (string memory _name, int _primeNumber) {
        name = _name;
        primeNumber = _primeNumber;
    }

    function getName() public view returns (string memory) {
        return name;
    }
    
    function getPrimeNumber() public view returns (int) {
        return primeNumber;
    }
}