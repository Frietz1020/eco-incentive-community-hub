# Exercise: Timelock

Implement a **timelock**: funds can only be withdrawn after a delay (e.g. 1 day) from when the withdrawal was scheduled.

## Requirements

- Owner can deposit AVAX (contract holds it).
- Owner can schedule a withdrawal (amount + delay); record the unlock timestamp.
- Execute withdrawal: only after unlock time has passed; send the amount to owner (or designated address).

## What to do

1. Implement the contract in `Timelock.sol` using the TODO hints.
2. Deploy to Fuji testnet and note the contract address.
3. In your PR, share your contract address and Snowtrace link.
