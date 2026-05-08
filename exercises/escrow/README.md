# Exercise: Escrow

Implement a simple **escrow** contract: one party deposits funds; another is released to a beneficiary when conditions are met.

## Requirements

- Depositor (or anyone) can deposit AVAX into the contract.
- Store beneficiary address and optional arbiter/owner.
- Release: owner or arbiter can release the full balance to the beneficiary.
- Optional: refund to depositor if release never happens (e.g. timeout or cancel).

## What to do

1. Implement the contract in `Escrow.sol` using the TODO hints.
2. Deploy to Fuji testnet and note the contract address.
3. In your PR, share your contract address and Snowtrace link.
