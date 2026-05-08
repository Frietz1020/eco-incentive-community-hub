// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DataTypes
 * @dev Basic Solidity types: uint, int, bool, address, bytes, string
 */
contract DataTypes {
    bool public flag = true;
    uint8 public small = 255;
    uint256 public big = type(uint256).max;
    int256 public signed = -1;
    address public addr = address(this);
    bytes32 public data = "hello";
    string public text = "Avalanche";
}
