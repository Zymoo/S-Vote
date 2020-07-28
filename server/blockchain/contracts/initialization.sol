pragma solidity ^0.6.9;

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
}
