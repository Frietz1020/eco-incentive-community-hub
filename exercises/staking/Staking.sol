// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Staking (Exercise)
 * @dev Minimal staking: users stake AVAX, can withdraw later.
 *
 * TODO: Add mapping for stakedBalance(address => uint256).
 * TODO: Add Staked and Unstaked events.
 * TODO: stake() payable: require value > 0, update stakedBalance[msg.sender], emit Staked.
 * TODO: unstake(amount): require sufficient staked balance, decrease balance, send AVAX to msg.sender, emit Unstaked.
 * TODO: receive() external payable: allow staking by sending AVAX to the contract (e.g. call stake logic).
 */
contract Staking {
    // TODO: your state variables

    // TODO: your events

    // TODO: function stake() external payable

    // TODO: function unstake(uint256 amount) external

    // TODO: receive() external payable
}
