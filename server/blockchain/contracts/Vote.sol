// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7;

contract Vote {
    
    string vote;
    string signature;

    constructor (string memory _vote, string memory _signature) {
        vote = _vote;
        signature = _signature;
    }

    function getVote() public view returns (string memory) {
        return vote;
    }
    
    function getSignature() public view returns (string memory) {
        return signature;
    }
}