// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonorRegistry {
    struct Donor {
        uint256 id;
        string metadataCID;
        uint256 usageCount;
        uint256 maxUsage;
        bool isActive;
        address owner;
    }

    mapping(uint256 => Donor) public donors;
    uint256 public donorCount;
    uint256 public totalSuccessfulMatches;

    event DonorRegistered(uint256 indexed donorId, address indexed owner, string metadataCID);
    event DonorUsageUpdated(uint256 indexed donorId, uint256 newUsageCount);
    event SuccessfulMatchIncremented(uint256 newTotalMatches);

    constructor() {
    }

    function registerDonor(string memory metadataCID, uint256 _maxUsage) public {
        require(bytes(metadataCID).length > 0, "Metadata CID cannot be empty");
        require(_maxUsage > 0, "Max usage must be greater than zero");

        donorCount++;
        donors[donorCount] = Donor(donorCount, metadataCID, 0, _maxUsage, true, msg.sender);

        emit DonorRegistered(donorCount, msg.sender, metadataCID);
    }

    function incrementDonorUsage(uint256 donorId) public {
        require(donorId > 0 && donorId <= donorCount, "Invalid donor ID");
        require(donors[donorId].isActive, "Donor is not active");
        require(donors[donorId].usageCount < donors[donorId].maxUsage, "Maximum usage reached");

        donors[donorId].usageCount++;

        if (donors[donorId].usageCount >= donors[donorId].maxUsage) {
            donors[donorId].isActive = false;
        }

        totalSuccessfulMatches++;
        emit DonorUsageUpdated(donorId, donors[donorId].usageCount);
        emit SuccessfulMatchIncremented(totalSuccessfulMatches);  
    }

    function getDonor(uint256 donorId) public view returns (Donor memory) {
        require(donorId > 0 && donorId <= donorCount, "Invalid donor ID");
        return donors[donorId];
    }

    function getTotalSuccessfulMatches() public view returns (uint256) {
        return totalSuccessfulMatches;
    }

    function getDonors() public view returns (Donor[] memory) {
        Donor[] memory allDonors = new Donor[](donorCount);  
        for (uint256 i = 1; i <= donorCount; i++) {
            allDonors[i - 1] = donors[i];  
        }
        return allDonors;
    }
}
