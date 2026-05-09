// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StateVariables
 * @dev Variables stored permanently on the blockchain
 */
contract StateVariables {
    uint256 public count;        // persisted in contract storage
    address public owner;       // stored on-chain
    bool public paused;

    constructor() {
        owner = msg.sender;
        count = 0;
        paused = false;
    }
}
