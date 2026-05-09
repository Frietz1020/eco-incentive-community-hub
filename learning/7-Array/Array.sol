// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Array
 * @dev Fixed-size and dynamic arrays
 */
contract Array {
    uint256[3] public fixedArray;
    uint256[] public dynamicArray;

    function push(uint256 x) external {
        dynamicArray.push(x);
    }

    function getLength() external view returns (uint256) {
        return dynamicArray.length;
    }

    function setFixed(uint256 index, uint256 value) external {
        require(index < 3, "Out of bounds");
        fixedArray[index] = value;
    }
}
