// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Functions
 * @dev Function types: view (read), pure (no read/write), and state-changing
 */
contract Functions {
    uint256 public value;

    function set(uint256 _value) external {
        value = _value;  // modifies state
    }

    function get() external view returns (uint256) {
        return value;  // reads state, no modification
    }

    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;  // no state read or write
    }
}
