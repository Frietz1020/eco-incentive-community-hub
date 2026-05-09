// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlobalVariables
 * @dev msg, block, tx — built-in globals
 */
contract GlobalVariables {
    // Mark payable because we read `msg.value` (and Solidity enforces that).
    function getGlobals() external payable returns (
        address sender,
        uint256 value,
        uint256 blockNum,
        uint256 timestamp,
        uint256 gasLimit
    ) {
        sender = msg.sender;      // who called
        value = msg.value;        // AVAX sent (wei)
        blockNum = block.number;
        timestamp = block.timestamp;
        gasLimit = block.gaslimit;
    }
}
