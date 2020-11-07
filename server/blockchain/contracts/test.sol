// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.8.0;

contract Test {
    uint number;

    constructor (uint256 val) {
        number = val;
    }

    function set(uint x) public {
        number = x;
    }

    function get() public view returns (uint) {
        return number;
    }

    function increment() public {
        number = number + 1;
    }
}