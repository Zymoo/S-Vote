// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

contract Initialization {
    struct Candidate {
        string fullName;
        uint number;
    }

    struct Voter {
        string fullName;
        string publicKey;
    }

    string publicKey;
    Candidate[] candidates;
    Voter[] registeredVoters;

    constructor (string memory key, Candidate[] memory candids, Voter[] memory voters) {
        publicKey = key;
        candidates = candids;
        registeredVoters = voters;
    }

    function getPublicKey() public view returns (string memory) {
        return publicKey;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters() public view returns (Voter[] memory) {
        return registeredVoters;
    }
}
