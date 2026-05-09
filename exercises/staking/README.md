# Exercise: Staking

Implement a **minimal staking contract** on Avalanche C-Chain.

## Requirements

- Users can stake AVAX (or a token) by calling a function and sending value.
- Track staked amount per user (`stakedBalance(address)`).
- Allow users to withdraw their stake after a lock period (e.g. no lock, or a simple time check).
- Optional: simple reward logic or events for stake / unstake.

## What to do

1. Implement your staking logic in `Staking.sol` (complete the stub).
2. Deploy to **Fuji testnet** and note the contract address.
3. In your Pull Request, mention your deployed contract address and Snowtrace link.

## Starter

See `Staking.sol` in this folder. Replace the stub with your implementation.
