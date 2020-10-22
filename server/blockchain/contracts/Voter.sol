// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7;

contract Voter {
    
    string publicKey;

    constructor (string memory _publicKey) {
        publicKey = _publicKey;
    }

    function getPublicKey() public view returns (string memory) {
        return publicKey;
    }
}