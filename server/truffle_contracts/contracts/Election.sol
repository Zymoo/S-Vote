// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

contract Election {
    struct Candidate {
        string fullName;
        uint number;
    }

    struct Result {
        int256 voteSum;
        int64[] individualScores;
        string ephermalKey;
    }

    Result electionResult;
    Candidate[] candidates;
    string[] voterKeys;
    string[] votes;
    string publicKey;

    function savePublicKey (string memory key) public {
        publicKey = key;
    }

    function saveCandidates (string[] memory names, uint[] memory numbers) public {
        for (uint i = 0; i < names.length; i++){
            candidates.push(Candidate({fullName: names[i], number: numbers[i]}));
        }
    }

    function saveResult(int256 sum, int64[] memory scores, string memory ephermal) public {
        electionResult = Result({voteSum: sum, individualScores: scores, ephermalKey: ephermal});
    }

    function saveVoterKey(string memory newKey) public {
        voterKeys.push(newKey);
    }

    function saveVote(string memory newVote) public {
        votes.push(newVote);
    }

    function getPublicKey() public view returns (string memory) {
        return publicKey;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotes() public view returns (string[] memory) {
        return votes;
    }

    function getResult() public view returns (Result memory){
        return electionResult;
    }
}
