// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Multisig (Exercise)
 * @dev N-of-M owners must approve before executing a transfer.
 *
 * TODO: Store list of owners (array or mapping) and threshold N.
 * TODO: Store pending transactions: to, value, approval count, executed flag.
 * TODO: Add mapping owner => txId => hasApproved.
 * TODO: submitTransaction(to, value): create pending tx; only callable by owner.
 * TODO: approveTransaction(txId): owner approves; increment count.
 * TODO: executeTransaction(txId): if approvals >= threshold and not executed, send AVAX to `to`, mark executed.
 * TODO: receive() to allow contract to hold AVAX.
 */
contract Multisig {
    // TODO: your state variables (owners, threshold, transactions, approvals)

    // TODO: your events

    // TODO: constructor(owners[], threshold)

    // TODO: submitTransaction(address to, uint256 value)

    // TODO: approveTransaction(uint256 txId)

    // TODO: executeTransaction(uint256 txId)

    // TODO: receive() external payable
}
