// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7;
import "./Candidate.sol";
import "./Voter.sol";
import "./Vote.sol";

contract Election {
    
    string publicKey;
    Candidate[] candidates;
    Voter[] voters;
    Vote[] votes;

    constructor (string memory _publicKey) {
        publicKey = _publicKey;
    }

    function getPublicKey() public view returns (string memory) {
        return publicKey;
    }
    
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters() public view returns (Voter[] memory) {
        return voters;
    }

    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }

    function addCandidate(string memory _name, int _prime) public {
        Candidate candidate = new Candidate(_name, _prime);
        candidates.push(candidate);
    }

    function addVoter(string memory _publicKey) public {
        Voter voter = new Voter(_publicKey);
        voters.push(voter);
    }

    function addVote(string memory _vote, string memory _signature) public {
        Vote vote = new Vote(_vote, _signature);
        votes.push(vote);
    }

}