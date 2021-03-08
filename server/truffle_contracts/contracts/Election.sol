// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

import "./ElectionToken.sol";
import "./CrowdSale.sol";

contract Election {
    struct Candidate {
        string fullName;
        uint number;
    }

    struct Result {
        uint256 voteSum;
        uint64[] individualScores;
        string ephermalKey;
    }

    ElectionToken public token;
    CrowdSale public crowdSale;

    address admin;
    Result electionResult;
    Candidate[] candidates;
    string[] voterKeys;
    string[] votes;
    string publicKey;


    constructor (ElectionToken _tokenContract, CrowdSale _crowdsale) public {
      admin = msg.sender;
      token = _tokenContract;
      crowdSale = _crowdsale;
    }

    receive() external payable {}  // allows to receive ether

    function savePublicKey (string memory key) public {
        require(msg.sender == admin);
        publicKey = key;
    }

    function saveCandidates (string[] memory names, uint[] memory numbers) public {
        require(msg.sender == admin);
        for (uint i = 0; i < names.length; i++){
            candidates.push(Candidate({fullName: names[i], number: numbers[i]}));
        }
    }

    function saveResult(uint256 sum, uint64[] memory scores, string memory ephermal) public {
        require(msg.sender == admin);
        electionResult = Result({voteSum: sum, individualScores: scores, ephermalKey: ephermal});
    }

    function saveVoterKey(string memory newKey) public {
        voterKeys.push(newKey);
    }

    function saveVote(string memory newVote) public payable {
        require(msg.value == 1);  // require to send 1ETH along the new vote
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