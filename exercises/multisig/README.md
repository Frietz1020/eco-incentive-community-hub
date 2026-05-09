# Exercise: Multisig (Simplified)

Build a **multi-signature** style contract: a transaction (e.g. send AVAX to an address) must be approved by at least N of M owners.

## Requirements

- Set M owner addresses (e.g. in constructor).
- Define a threshold N (e.g. 2 of 3).
- Submit a transaction: destination address and amount.
- Owners can approve a pending transaction (by ID or nonce).
- Execute: when approvals >= N, send the AVAX to the destination.

## What to do

1. Implement the contract in `Multisig.sol` using the TODO hints.
2. Deploy to Fuji testnet and note the contract address.
3. In your PR, share your contract address and Snowtrace link.
