// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Struct
 * @dev Custom types grouping related data
 */
contract Struct {
    struct Person {
        string name;
        uint256 age;
        address wallet;
    }

    Person[] public people;

    function add(string calldata _name, uint256 _age) external {
        people.push(Person({ name: _name, age: _age, wallet: msg.sender }));
    }

    function get(uint256 index) external view returns (string memory, uint256, address) {
        Person memory p = people[index];
        return (p.name, p.age, p.wallet);
    }
}
