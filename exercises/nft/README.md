# Exercise: NFT

Mint and transfer a **basic NFT** (ERC721-style) on Avalanche C-Chain.

## Requirements

- Each token has a unique ID; track owner per token.
- `mint(to, tokenId)` — create a new token (e.g. only owner can mint).
- `ownerOf(tokenId)` — return owner address.
- `transferFrom(from, to, tokenId)` — transfer NFT (with ownership check).
- Optional: `name`, `symbol`, or `tokenURI` placeholder.

## What to do

1. Implement your NFT in `NFT.sol` (complete the stub).
2. Deploy to **Fuji testnet** and note the contract address.
3. In your Pull Request, mention your deployed contract address and Snowtrace link.

## Starter

See `NFT.sol` in this folder. Replace the stub with your implementation.
