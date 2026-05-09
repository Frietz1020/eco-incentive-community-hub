// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StorageLocations
 * @dev storage (persistent), memory (temporary), calldata (read-only input)
 */
contract StorageLocations {
    string public stored;  // storage

    function set(string calldata _input) external {
        stored = _input;  // calldata → storage
    }

    function getCopy() external view returns (string memory) {
        return stored;  // storage → memory (copy for return)
    }

    function concat(string calldata a, string calldata b) external pure returns (string memory) {
        return string(abi.encodePacked(a, b));  // calldata + memory
    }
}
