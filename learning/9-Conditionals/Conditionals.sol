// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Conditionals
 * @dev if/else, require, ternary
 */
contract Conditionals {
    function check(uint256 x) external pure returns (string memory) {
        if (x < 10) return "small";
        else if (x < 100) return "medium";
        else return "large";
    }

    function onlyPositive(uint256 x) external pure returns (uint256) {
        require(x > 0, "Must be positive");
        return x;
    }

    function min(uint256 a, uint256 b) external pure returns (uint256) {
        return a < b ? a : b;  // ternary
    }
}
