// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Timelock (Exercise)
 * @dev Withdraw only after a delay from when withdrawal was scheduled.
 *
 * TODO: Add owner address.
 * TODO: Add scheduled amount and unlock timestamp (when withdrawal is allowed).
 * TODO: Add event for Scheduled and Executed.
 * TODO: receive() to accept AVAX (deposits).
 * TODO: scheduleWithdrawal(amount, delayInSeconds): only owner; set amount and unlock = block.timestamp + delay.
 * TODO: executeWithdrawal(): only owner; require block.timestamp >= unlock; send amount to owner; clear scheduled data.
 */
contract Timelock {
    // TODO: your state variables

    // TODO: your events

    // TODO: constructor (set owner)

    // TODO: scheduleWithdrawal(uint256 amount, uint256 delayInSeconds)

    // TODO: executeWithdrawal()

    // TODO: receive() external payable
}
