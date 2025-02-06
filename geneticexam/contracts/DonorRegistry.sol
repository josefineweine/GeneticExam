// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonorRegistry {
    struct Donor {
        uint256 id;
        string metadataCID; // Stores all donor details in a decentralized database (IPFS, Arweave, etc.)
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

    function registerDonor(string memory metadataCID) public {
        require(bytes(metadataCID).length > 0, "Metadata CID cannot be empty");

        donorCount++;
        donors[donorCount] = Donor({
            id: donorCount,
            metadataCID: metadataCID,
            usageCount: 0,
            maxUsage: 3,
            isActive: true,
            owner: msg.sender
        });

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
    }
}
