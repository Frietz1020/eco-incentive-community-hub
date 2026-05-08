// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This file is an "import hub" so Hardhat compiles every contract in this repo.
// It does not need to define any runtime logic; we only deploy/verify the contracts
// declared inside the imported files.

// Learning
import "../learning/1-Intro/Intro.sol";
import "../learning/2-State-Variables/StateVariables.sol";
import "../learning/3-Local-Variables/LocalVariables.sol";
import "../learning/4-Function/Functions.sol";
import "../learning/5-Constructor/Constructor.sol";
import "../learning/6-Data-Types/DataTypes.sol";
import "../learning/7-Array/Array.sol";
import "../learning/8-Loops/Loops.sol";
import "../learning/9-Conditionals/Conditionals.sol";
import "../learning/10-Struct/Struct.sol";
import "../learning/11-Mapping/Mapping.sol";
import "../learning/12-Storage-Locations/StorageLocations.sol";
import "../learning/13-Global-Variables/GlobalVariables.sol";
import "../learning/14-Contract-Balance/ContractBalance.sol";
import "../learning/15-Visibility/Visibility.sol";

// Exercises
import "../exercises/voting/Voting.sol";
import "../exercises/token/Token.sol";
import "../exercises/timelock/Timelock.sol";
import "../exercises/staking/Staking.sol";
import "../exercises/nft/NFT.sol";
import "../exercises/multisig/Multisig.sol";
import "../exercises/escrow/Escrow.sol";
import "../exercises/auction/Auction.sol";

// Starter contracts
import "./SimpleStorage.sol";
import "./AvalancheGreeter.sol";

