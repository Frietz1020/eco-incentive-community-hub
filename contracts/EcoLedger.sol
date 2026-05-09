/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EcoLedger
 * @dev Access-controlled sustainability action ledger with non-transferable GreenPoints.
 */
contract EcoLedger {
    address public admin;
    mapping(address => uint256) public points;
    uint256 public totalActionsRecorded;
    mapping(address => uint256) public actionCount;

    event ActionRecorded(address indexed participant, string actionType, uint256 timestamp);
    event PointsAwarded(address indexed participant, uint256 amount, uint256 newTotal);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    constructor() {
        admin = msg.sender;
    }

    function recordAction(
        address participant,
        string calldata actionType,
        uint256 pointsToAward
    ) external {
        require(msg.sender == admin, "Only admin");
        require(participant != address(0), "Invalid address");
        require(pointsToAward > 0, "Points must be > 0");

        points[participant] += pointsToAward;
        totalActionsRecorded++;
        actionCount[participant]++;

        emit ActionRecorded(participant, actionType, block.timestamp);
        emit PointsAwarded(participant, pointsToAward, points[participant]);
    }

    function getPoints(address participant) external view returns (uint256) {
        return points[participant];
    }

    function transferAdmin(address newAdmin) external {
        require(msg.sender == admin, "Only admin");
        require(newAdmin != address(0), "Invalid address");

        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }
}
