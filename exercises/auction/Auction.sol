// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Auction (Exercise)
 * @dev Highest bid wins; owner ends auction and sends funds to beneficiary.
 *
 * TODO: Add beneficiary and owner addresses.
 * TODO: Add highestBidder and highestBid amount.
 * TODO: Add ended flag (auction closed).
 * TODO: Add event BidPlaced and AuctionEnded.
 * TODO: bid() payable: require not ended; require msg.value > highestBid; optionally refund previous highest; update highestBidder and highestBid.
 * TODO: endAuction(): only owner; set ended; send highestBid to beneficiary (transfer AVAX).
 * TODO: receive or ensure bid() is the only way to send AVAX (so refunds work).
 */
contract Auction {
    // TODO: your state variables

    // TODO: your events

    // TODO: constructor(beneficiary)

    // TODO: function bid() external payable

    // TODO: function endAuction() external
}
