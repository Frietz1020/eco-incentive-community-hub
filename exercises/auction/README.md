# Exercise: Simple Auction

Implement a **simple auction**: highest bidder wins; bids are in AVAX; owner can end the auction and send the funds to a beneficiary.

## Requirements

- Store beneficiary (who receives the winning bid) and owner (who can end auction).
- Accept bids: store bidder address and amount; require new bid > current highest bid; optionally refund previous highest.
- End auction: only owner; send highest bid amount to beneficiary; record winner.
- Optional: get current highest bidder and amount via view functions.

## What to do

1. Implement the contract in `Auction.sol` using the TODO hints.
2. Deploy to Fuji testnet and note the contract address.
3. In your PR, share your contract address and Snowtrace link.
