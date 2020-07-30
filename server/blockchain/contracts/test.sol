pragma solidity ^0.6.12;

contract Test {
    string name;

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory s) public {
        name = s;
    }
}
