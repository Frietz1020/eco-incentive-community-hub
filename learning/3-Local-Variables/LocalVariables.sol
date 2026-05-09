// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LocalVariables
 * @dev Variables that exist only during function execution
 */
contract LocalVariables {
    function add(uint256 a, uint256 b) external pure returns (uint256) {
        uint256 sum = a + b;  // local — not stored on chain
        return sum;
    }

    function getBlockInfo() external view returns (uint256, uint256) {
        uint256 blockNum = block.number;      // local
        uint256 timestamp = block.timestamp;  // local
        return (blockNum, timestamp);
    }
}
