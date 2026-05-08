// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleStorage
 * @dev Minimal storage contract for learning and testing on Avalanche
 */
contract SimpleStorage {
    uint256 private _value;

    event ValueUpdated(uint256 oldValue, uint256 newValue);

    function set(uint256 value) external {
        uint256 oldValue = _value;
        _value = value;
        emit ValueUpdated(oldValue, value);
    }

    function get() external view returns (uint256) {
        return _value;
    }
}
