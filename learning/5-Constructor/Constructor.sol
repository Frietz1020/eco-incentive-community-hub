// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Constructor
 * @dev Runs once when the contract is deployed
 */
contract Constructor {
    address public owner;
    uint256 public createdAt;

    constructor() {
        owner = msg.sender;           // set deployer as owner
        createdAt = block.timestamp;  // deployment time
    }
}
