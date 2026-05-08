// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Loops
 * @dev for, while — use carefully to avoid gas limits
 */
contract Loops {
    uint256[] public numbers;

    function addNumbers(uint256[] calldata _numbers) external {
        for (uint256 i = 0; i < _numbers.length; i++) {
            numbers.push(_numbers[i]);
        }
    }

    function sum() external view returns (uint256 total) {
        for (uint256 i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
    }
}
