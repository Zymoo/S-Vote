// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

contract Election {
    struct Candidate {
        string fullName;
        uint number;
    }

    struct Voter {
        string fullName;
        string publicKey;
    }

    Candidate[] candidates;
    string publicKey;

    function savePublicKey (string memory key) public {
        publicKey = key;
    }

    function saveCandidates (string[] memory names, uint[] memory numbers) public {
        for ( uint i = 0; i < names.length; i++){
            candidates.push(Candidate({fullName: names[i], number: numbers[i]}));
        }
    }

    function getPublicKey() public view returns (string memory) {
        return publicKey;
    }

    // function getCandidates() public view returns (Candidate[] memory) {
    //     return candidates;
    // }

}
