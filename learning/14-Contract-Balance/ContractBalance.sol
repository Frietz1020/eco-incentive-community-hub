// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContractBalance
 * @dev Receiving AVAX and checking contract balance
 */
contract ContractBalance {
    function deposit() external payable {}

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
