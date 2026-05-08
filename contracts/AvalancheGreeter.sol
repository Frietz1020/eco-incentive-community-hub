// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AvalancheGreeter
 * @dev Simple starter contract for Avalanche C-Chain deployment
 */
contract AvalancheGreeter {
    string public greeting;
    address public owner;

    event GreetingUpdated(string oldGreeting, string newGreeting);

    constructor(string memory _greeting) {
        greeting = _greeting;
        owner = msg.sender;
    }

    function setGreeting(string memory _greeting) external {
        require(msg.sender == owner, "Only owner can set greeting");
        string memory oldGreeting = greeting;
        greeting = _greeting;
        emit GreetingUpdated(oldGreeting, _greeting);
    }

    function getGreeting() external view returns (string memory) {
        return greeting;
    }
}
