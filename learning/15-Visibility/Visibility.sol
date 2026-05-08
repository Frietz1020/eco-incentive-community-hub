// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Visibility
 * @dev public, private, internal, external
 */
contract Visibility {
    uint256 public publicVar;      // anyone, getter auto-generated
    uint256 private privateVar;    // this contract only
    uint256 internal internalVar; // this + derived contracts

    function setPrivate(uint256 x) external {
        privateVar = x;
    }

    function setInternal(uint256 x) external {
        internalVar = x;
    }

    function getPrivate() external view returns (uint256) {
        return privateVar;
    }

    function externalFn(uint256 x) external pure returns (uint256) {
        return x * 2;  // external: only callable from outside
    }
}
