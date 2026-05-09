// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Mapping
 * @dev Key-value storage: address => value, etc.
 */
contract Mapping {
    mapping(address => uint256) public balances;
    mapping(address => bool) public hasDeposited;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        hasDeposited[msg.sender] = true;
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
